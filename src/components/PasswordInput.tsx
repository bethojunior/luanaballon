'use client';

import { useState } from 'react';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** Campo de senha com botão para mostrar/ocultar. */
export default function PasswordInput({ className = '', ...props }: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? 'text' : 'password'} className={`input pr-12 ${className}`} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={show}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center text-xl opacity-70 hover:opacity-100"
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}
