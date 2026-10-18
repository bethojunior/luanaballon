'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const INSTALLED_KEY = 'pwa-app-installed'
const DISMISSED_KEY = 'pwa-dismissed-until'
const DISMISS_DURATION_MS = 5 * 60 * 1000

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function readInstalled(): boolean {
  try {
    return localStorage.getItem(INSTALLED_KEY) === '1'
  } catch {
    return false
  }
}

function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}

function isDismissed(): boolean {
  try {
    const until = localStorage.getItem(DISMISSED_KEY)
    if (!until) return false
    return Date.now() < parseInt(until, 10)
  } catch {
    return false
  }
}

function shouldShowInstallFlow(): boolean {
  if (!isMobile()) return false
  if (isStandalone()) return false
  if (readInstalled()) return false
  if (isDismissed()) return false
  return true
}

export function PwaInstallPrompt({ name }: { name: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [portalReady, setPortalReady] = useState(false)

  useEffect(() => setPortalReady(true), [])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (isStandalone()) {
      try {
        localStorage.setItem(INSTALLED_KEY, '1')
      } catch {
        /* ignore */
      }
    }

    const onInstalled = () => {
      try {
        localStorage.setItem(INSTALLED_KEY, '1')
      } catch {
        /* ignore */
      }
      setVisible(false)
      setDeferredPrompt(null)
    }
    window.addEventListener('appinstalled', onInstalled)

    const handler = (e: Event) => {
      e.preventDefault()
      if (!shouldShowInstallFlow()) return
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!visible || !deferredPrompt || !portalReady) return null

  const handleInstall = async () => {
    try {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') {
        try {
          localStorage.setItem(INSTALLED_KEY, '1')
        } catch {
          /* ignore */
        }
        setVisible(false)
        setDeferredPrompt(null)
      }
    } catch (error) {
      console.error('[PWA] Erro ao mostrar prompt de instalação', error)
    }
  }

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now() + DISMISS_DURATION_MS))
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  return createPortal(
    <div
      className='fixed inset-0 z-[99999] isolate flex flex-col justify-end bg-black/50 px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] backdrop-blur-[2px]'
      role='dialog'
      aria-modal='true'
      aria-labelledby='pwa-install-title'
      onClick={handleDismiss}
    >
      <div className='mx-auto w-full max-w-md' onClick={(e) => e.stopPropagation()}>
        <div className='flex flex-col gap-3 rounded-2xl bg-gray-900 p-4 text-white shadow-2xl ring-1 ring-white/10 sm:flex-row sm:items-center'>
          <div className='min-w-0 flex-1'>
            <p id='pwa-install-title' className='text-sm font-semibold'>
              Adicionar {name} à tela inicial
            </p>
            <p className='text-xs text-gray-300'>
              Acesse mais rápido como se fosse um app instalado.
            </p>
          </div>
          <div className='flex shrink-0 flex-wrap gap-2 sm:justify-end'>
            <button
              type='button'
              onClick={handleDismiss}
              className='rounded-lg border border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-800'
            >
              Agora não
            </button>
            <button
              type='button'
              onClick={handleInstall}
              className='rounded-lg bg-pink px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-dark'
            >
              Instalar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
