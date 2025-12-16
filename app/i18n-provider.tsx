"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import en from "./locales/en.json"
import ru from "./locales/ru.json"

type Messages = Record<string, string>

const locales: Record<string, Messages> = {
  en,
  ru,
}

type I18nContextShape = {
  t: (k: string) => string
  locale: string
  setLocale: (l: string) => void
}

const I18nContext = createContext<I18nContextShape>({
  t: (k: string) => k,
  locale: "ru",
  setLocale: () => {},
})

export function I18nProvider({ children, locale = "ru" }: { children: ReactNode; locale?: string }) {
  const [loc, setLoc] = useState(locale)
  
  // Сохраняем выбранный язык в localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale && locales[savedLocale]) {
      setLoc(savedLocale)
    }
  }, [])

  const handleSetLocale = (newLocale: string) => {
    if (locales[newLocale]) {
      setLoc(newLocale)
      localStorage.setItem('locale', newLocale)
    }
  }

  const messages = locales[loc] ?? locales.ru
  const t = (key: string) => messages[key] ?? key

  return (
    <I18nContext.Provider value={{ t, locale: loc, setLocale: handleSetLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useT() {
  return useContext(I18nContext).t
}

export function useLocale() {
  const { locale, setLocale } = useContext(I18nContext)
  return { locale, setLocale }
}

export default I18nProvider
