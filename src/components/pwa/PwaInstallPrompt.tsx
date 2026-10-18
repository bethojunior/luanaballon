'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const DISMISSED_KEY = 'pwa-dismissed-until'
/** Depois de "Agora não" o convite volta sozinho, sem precisar recarregar a página. */
const RETRY_MS = 45 * 1000

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

const isMobile = () => window.matchMedia('(pointer: coarse)').matches
const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

function readDismissedUntil(): number {
  try {
    return parseInt(localStorage.getItem(DISMISSED_KEY) || '0', 10) || 0
  } catch {
    return 0
  }
}

export function PwaInstallPrompt({ name }: { name: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [eligible, setEligible] = useState(false)
  const [ios, setIos] = useState(false)
  const [manual, setManual] = useState(false)
  const [until, setUntil] = useState(0)
  const [now, setNow] = useState(0)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    setIos(isIOS())
    setEligible(isMobile() && !isStandalone())
    setUntil(readDismissedUntil())
    setNow(Date.now())

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setManual(false)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  // reabre o convite quando o tempo de "Agora não" termina
  useEffect(() => {
    if (!until) return
    const wait = until - Date.now()
    if (wait <= 0) return setNow(Date.now())
    const t = setTimeout(() => setNow(Date.now()), wait + 50)
    return () => clearTimeout(t)
  }, [until])

  const dismiss = useCallback(() => {
    const next = Date.now() + RETRY_MS
    try {
      localStorage.setItem(DISMISSED_KEY, String(next))
    } catch {
      /* ignore */
    }
    setUntil(next)
    setNow(Date.now())
  }, [])

  const install = async () => {
    if (!deferred) return
    try {
      await deferred.prompt()
      const choice = await deferred.userChoice
      if (choice.outcome === 'accepted') setInstalled(true)
      else setManual(true) // o evento só vale uma vez: orienta a instalar pelo menu enquanto o navegador não libera outro
    } catch (error) {
      console.error('[PWA] Erro ao mostrar prompt de instalação', error)
      setManual(true)
    }
    setDeferred(null)
  }

  const canShowSomething = !!deferred || ios || manual
  const visible = eligible && !installed && canShowSomething && now >= until

  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [visible])

  if (!visible) return null

  return createPortal(
    <div
      className='fixed inset-0 z-[99999] isolate flex flex-col justify-end bg-black/60 px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] backdrop-blur-[2px]'
      role='dialog'
      aria-modal='true'
      aria-labelledby='pwa-install-title'
    >
      <div className='mx-auto w-full max-w-md rounded-2xl bg-gray-900 p-5 text-white shadow-2xl ring-1 ring-white/10'>
        <p id='pwa-install-title' className='text-base font-semibold'>
          Instale o app {name}
        </p>
        <p className='mt-1 text-sm text-gray-300'>
          Acesse mais rápido, direto da tela inicial, como um aplicativo.
        </p>

        {deferred ? (
          <p className='mt-3 text-sm text-gray-300'>Toque em <b>Instalar</b> e confirme. Leva poucos segundos.</p>
        ) : ios ? (
          <ol className='mt-3 list-decimal space-y-1 pl-5 text-sm text-gray-200'>
            <li>Toque em <b>Compartilhar</b> (o ícone de quadrado com seta) na barra do Safari.</li>
            <li>Escolha <b>Adicionar à Tela de Início</b>.</li>
            <li>Toque em <b>Adicionar</b>.</li>
          </ol>
        ) : (
          <ol className='mt-3 list-decimal space-y-1 pl-5 text-sm text-gray-200'>
            <li>Toque no menu <b>⋮</b> do navegador.</li>
            <li>Escolha <b>Instalar aplicativo</b> ou <b>Adicionar à tela inicial</b>.</li>
          </ol>
        )}

        <div className='mt-4 flex gap-2'>
          <button
            type='button'
            onClick={dismiss}
            className='flex-1 rounded-xl border border-gray-600 px-4 py-3 text-sm font-medium text-gray-200 active:bg-gray-800'
          >
            Agora não
          </button>
          {deferred && (
            <button
              type='button'
              onClick={install}
              className='flex-[2] rounded-xl bg-pink px-4 py-3 text-sm font-bold text-white active:bg-pink-dark'
            >
              Instalar
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
