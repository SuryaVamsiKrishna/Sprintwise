import React, { useState } from "react";
import { Chart } from "react-google-charts";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { enUS, hi, es, fr, ja } from 'date-fns/locale';
import "react-calendar/dist/Calendar.css";
import "./YourWork.css";

// Language data (hardcoded translations for simplicity)
const translations = {
  en: {
    title: "Your Work and Analysis",
    timeline: "Project Timeline",
    calendar: "Personal Calendar",
    tasks: [
      { name: "User Authentication", dueDate: "2024-06-01", status: "In Progress", priority: "High" },
      { name: "Checkout feature", dueDate: "2024-06-15", status: "Completed", priority: "Medium" },
      { name: "Integration of AI", dueDate: "2024-10-15", status: "In Progress", priority: "High" },
      { name: "Campaign webpage", dueDate: "2024-07-01", status: "Not Started", priority: "Low" },
      { name: "Data Analysis Tab", dueDate: "2024-07-20", status: "In Progress", priority: "High" },
      { name: "Product design review", dueDate: "2024-08-01", status: "Completed", priority: "Medium" },
      { name: "Event planning page", dueDate: "2024-10-01", status: "Not Started", priority: "Low" },
    ],
  },
  hi: {
    title: "आपका काम और विश्लेषण",
    timeline: "प्रोजेक्ट टाइमलाइन",
    calendar: "व्यक्तिगत कैलेंडर",
    tasks: [
      { name: "उपयोगकर्ता प्रमाणीकरण", dueDate: "2024-06-01", status: "प्रगति में", priority: "उच्च" },
      { name: "चेकआउट फीचर", dueDate: "2024-06-15", status: "पूर्ण", priority: "मध्यम" },
      { name: "एआई का एकीकरण", dueDate: "2024-10-15", status: "प्रगति में", priority: "उच्च" },
      { name: "कैम्पेन वेबपेज", dueDate: "2024-07-01", status: "शुरू नहीं हुआ", priority: "निम्न" },
      { name: "डेटा विश्लेषण टैब", dueDate: "2024-07-20", status: "प्रगति में", priority: "उच्च" },
      { name: "उत्पाद डिज़ाइन समीक्षा", dueDate: "2024-08-01", status: "पूर्ण", priority: "मध्यम" },
      { name: "इवेंट योजना पृष्ठ", dueDate: "2024-10-01", status: "शुरू नहीं हुआ", priority: "निम्न" },
    ],
  },
  es: {
    title: "Tu trabajo y análisis",
    timeline: "Línea de tiempo del proyecto",
    calendar: "Calendario personal",
    tasks: [
      { name: "Autenticación de usuario", dueDate: "2024-06-01", status: "En progreso", priority: "Alto" },
      { name: "Función de pago", dueDate: "2024-06-15", status: "Completado", priority: "Medio" },
      { name: "Integración de IA", dueDate: "2024-10-15", status: "En progreso", priority: "Alto" },
      { name: "Página de campaña", dueDate: "2024-07-01", status: "No iniciado", priority: "Bajo" },
      { name: "Pestaña de análisis de datos", dueDate: "2024-07-20", status: "En progreso", priority: "Alto" },
      { name: "Revisión de diseño de producto", dueDate: "2024-08-01", status: "Completado", priority: "Medio" },
      { name: "Página de planificación de eventos", dueDate: "2024-10-01", status: "No iniciado", priority: "Bajo" },
    ],
  },
  fr: {
    title: "Votre travail et analyse",
    timeline: "Chronologie du projet",
    calendar: "Calendrier personnel",
    tasks: [
      { name: "Authentification de l'utilisateur", dueDate: "2024-06-01", status: "En cours", priority: "Élevé" },
      { name: "Fonction de paiement", dueDate: "2024-06-15", status: "Terminé", priority: "Moyenne" },
      { name: "Intégration de l'IA", dueDate: "2024-10-15", status: "En cours", priority: "Élevé" },
      { name: "Page de la campagne", dueDate: "2024-07-01", status: "Pas commencé", priority: "Bas" },
      { name: "Onglet d'analyse des données", dueDate: "2024-07-20", status: "En cours", priority: "Élevé" },
      { name: "Revue de la conception du produit", dueDate: "2024-08-01", status: "Terminé", priority: "Moyenne" },
      { name: "Page de planification d'événements", dueDate: "2024-10-01", status: "Pas commencé", priority: "Bas" },
    ],
  },
  ja: {
    title: "あなたの作業と分析",
    timeline: "プロジェクトのタイムライン",
    calendar: "個人カレンダー",
    tasks: [
      { name: "ユーザー認証", dueDate: "2024-06-01", status: "進行中", priority: "高" },
      { name: "チェックアウト機能", dueDate: "2024-06-15", status: "完了", priority: "中" },
      { name: "AIの統合", dueDate: "2024-10-15", status: "進行中", priority: "高" },
      { name: "キャンペーンウェブページ", dueDate: "2024-07-01", status: "未開始", priority: "低" },
      { name: "データ分析タブ", dueDate: "2024-07-20", status: "進行中", priority: "高" },
      { name: "製品デザインレビュー", dueDate: "2024-08-01", status: "完了", priority: "中" },
      { name: "イベントプランニングページ", dueDate: "2024-10-01", status: "未開始", priority: "低" },
    ],
  },
};

const YourWork = () => {
  const [language, setLanguage] = useState("en");
  const [value, onChange] = useState(new Date());

  // Get current translations based on selected language
  const { title, timeline, calendar, tasks } = translations[language];

  // Select locale based on language
  const locales = {
    en: enUS,
    hi: hi,
    es: es,
    fr: fr,
    ja: ja,
  };

  const selectedLocale = locales[language];

  const timelineData = [
    [
      { type: "string", id: "Task" },
      { type: "string", id: "Name" },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ],
    ...tasks.map((task, index) => [
      index.toString(),
      task.name,
      new Date(2024, 0, 1), // Assuming tasks start from January 1, 2024
      new Date(task.dueDate),
    ]),
  ];

  // Custom month-year format
  const formatMonthYear = (locale, date) => format(date, "MMMM yyyy", { locale: selectedLocale });

  // Custom weekday format
  const formatShortWeekday = (locale, date) => format(date, "EEE", { locale: selectedLocale });

  // Custom day format
  const formatDay = (locale, date) => format(date, "d", { locale: selectedLocale });

  return (
    <div className="your-work-container">
      <div className="language-selector">
        <button onClick={() => setLanguage("en")}>English</button>
        <button onClick={() => setLanguage("hi")}>हिंदी</button>
        <button onClick={() => setLanguage("es")}>Español</button>
        <button onClick={() => setLanguage("fr")}>Français</button>
        <button onClick={() => setLanguage("ja")}>日本語</button>
      </div>

      <h1>{title}</h1>

      <div className="timeline-section">
        <h2>{timeline}</h2>
        <Chart
          chartType="Timeline"
          width="100%"
          height="400px"
          loader={<div>Loading Chart</div>}
          data={timelineData}
        />
      </div>

      <div className="calendar-section">
        <h2>{calendar}</h2>
        <Calendar
          onChange={onChange}
          value={value}
          locale={selectedLocale}
          formatMonthYear={formatMonthYear}
          formatDay={formatDay}
          formatShortWeekday={formatShortWeekday}
        />
      </div>
    </div>
  );
};

export default YourWork;
