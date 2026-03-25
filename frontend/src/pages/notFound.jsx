import React from "react"
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="display-1">{t('notFound.title')}</h1>
      <p className="lead">{t('notFound.message')}</p>
    </div>
    )
}
