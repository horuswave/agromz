"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import React from "react";
// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type Category =
  | "Cereais"
  | "Vegetais"
  | "Frutas"
  | "Tubérculos"
  | "Leguminosas"
  | "Outros";
type AlertType = "drought" | "flood" | "pest" | "frost";
type SortKey = "recent" | "price_asc" | "price_desc" | "rating";
type Tab = "mercado" | "trocas" | "alertas" | "dicas";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  location: string;
  province: string;
  contact: string;
  category: Category;
  image?: string;
  harvestDate?: string;
  organic: boolean;
  barter: boolean;
  barterFor?: string;
  transport: boolean;
  rating?: number;
  postedAt: number;
}

interface WeatherAlert {
  province: string;
  type: AlertType;
  severity: "low" | "medium" | "high";
  headline: string;
  detail: string;
}

interface Tip {
  category: string;
  title: string;
  body: string;
  tag: string;
}

// ─────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────
const PROVINCES = [
  "Maputo Cidade",
  "Maputo Província",
  "Gaza",
  "Inhambane",
  "Sofala",
  "Manica",
  "Tete",
  "Zambézia",
  "Nampula",
  "Cabo Delgado",
  "Niassa",
];
const UNITS: string[] = [
  "kg",
  "ton",
  "saco (50kg)",
  "caixa",
  "maço",
  "unidade",
  "litro",
];
const CATEGORIES: Category[] = [
  "Cereais",
  "Vegetais",
  "Frutas",
  "Tubérculos",
  "Leguminosas",
  "Outros",
];

const CAT_COLOR: Record<string, string> = {
  Cereais: "#B07020",
  Vegetais: "#2D7A4F",
  Frutas: "#B84E1D",
  Tubérculos: "#7B5C2E",
  Leguminosas: "#1D5F7A",
  Outros: "#5A5A5A",
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p3",
    name: "Tomate Fresco",
    price: 500,
    unit: "caixa",
    quantity: 50,
    location: "Nampula",
    province: "Nampula",
    contact: "86 345 6789",
    category: "Vegetais",
    image: "/tomate.jpg",
    harvestDate: "Mai 2025",
    organic: true,
    barter: false,
    transport: true,
    rating: 4.8,
    postedAt: Date.now() - 1800000,
  },
  {
    id: "p4",
    name: "Mandioca",
    price: 800,
    unit: "saco (50kg)",
    quantity: 30,
    location: "Quelimane",
    province: "Zambézia",
    contact: "87 456 7890",
    category: "Tubérculos",
    image: "/mandioca.jpg",
    harvestDate: "Mai 2025",
    organic: true,
    barter: false,
    transport: false,
    rating: 4.0,
    postedAt: Date.now() - 86400000,
  },
  {
    id: "p5",
    name: "Amendoim",
    price: 3500,
    unit: "saco (50kg)",
    quantity: 8,
    location: "Tete",
    province: "Tete",
    contact: "82 567 8901",
    category: "Leguminosas",
    image: "/amendoim.jpg",
    harvestDate: "Abr 2025",
    organic: false,
    barter: true,
    barterFor: "Milho ou feijão",
    transport: true,
    rating: 4.6,
    postedAt: Date.now() - 172800000,
  },
  {
    id: "p6",
    name: "Banana Prata",
    price: 600,
    unit: "caixa",
    quantity: 100,
    location: "Inhambane",
    province: "Inhambane",
    contact: "84 678 9012",
    category: "Frutas",
    image: "/banana.jpg",
    harvestDate: "Mai 2025",
    organic: true,
    barter: false,
    transport: true,
    rating: 4.3,
    postedAt: Date.now() - 600000,
  },
  {
    id: "p7",
    name: "Feijão Nhemba",
    price: 2800,
    unit: "saco (50kg)",
    quantity: 15,
    location: "Lichinga",
    image: "/feijao-nhemba.jpg",
    province: "Niassa",
    contact: "84 789 0123",
    category: "Leguminosas",
    harvestDate: "Abr 2025",
    organic: true,
    barter: true,
    barterFor: "Arroz ou milho",
    transport: false,
    rating: 4.7,
    postedAt: Date.now() - 3600000,
  },
  {
    id: "p8",
    name: "Batata-Doce",
    price: 700,
    unit: "saco (50kg)",
    quantity: 25,
    location: "Chimoio",
    province: "Manica",
    contact: "86 890 1234",
    category: "Tubérculos",
    image: "/batatata-doce.jpg",
    organic: false,
    barter: false,
    transport: true,
    rating: 4.1,
    postedAt: Date.now() - 14400000,
  },
];

const ALERTS: WeatherAlert[] = [
  {
    province: "Gaza",
    type: "drought",
    severity: "high",
    headline: "Seca Severa",
    detail:
      "Défice hídrico crítico nas próximas 3 semanas. Priorize irrigação nocturna e aplique mulch para reduzir a evaporação do solo.",
  },
  {
    province: "Zambézia",
    type: "flood",
    severity: "medium",
    headline: "Risco de Cheias",
    detail:
      "Nível do Zambeze em subida. Eleve sacas do solo, proteja os stocks armazenados e evite plantações em zonas ribeirinhas por 10 dias.",
  },
  {
    province: "Nampula",
    type: "pest",
    severity: "medium",
    headline: "Lagarta do Cartucho",
    detail:
      "Infestação de Spodoptera frugiperda detectada. Aplique Bacillus thuringiensis ou inspeccione as folhas diariamente.",
  },
  {
    province: "Cabo Delgado",
    type: "frost",
    severity: "low",
    headline: "Noites Frias",
    detail:
      "Temperaturas nocturnas abaixo de 10 °C esperadas. Cubra culturas sensíveis como tomate e pimento com agrotêxtil.",
  },
];

const TIPS: Tip[] = [
  {
    category: "Pós-Colheita",
    title: "Silos Herméticos a Baixo Custo",
    body: "Silos PICS ou IRRI reduzem perdas pós-colheita até 90% sem electricidade. Disponíveis pelo Ministério da Agricultura por menos de 2 000 MZN.",
    tag: "Armazenamento",
  },
  {
    category: "Água",
    title: "Gotejamento Artesanal",
    body: "Garrafas PET furadas enterradas junto à raiz fornecem irrigação de gotejamento a custo zero — reduz o consumo hídrico em 50%, ideal para Gaza e Tete.",
    tag: "Irrigação",
  },
  {
    category: "Solo",
    title: "Adubação Verde com Feijão Nhemba",
    body: "Plante nhemba entre culturas para fixar até 100 kg N/ha no solo. Incorpore a biomassa 30 dias antes do próximo plantio.",
    tag: "Fertilidade",
  },
  {
    category: "Pagamentos",
    title: "M-Pesa e E-Mola",
    body: "Receba pagamentos via M-Pesa (Vodacom) ou E-Mola (Movitel) sem deslocação — ideal para transacções entre províncias distantes.",
    tag: "Finanças",
  },
  {
    category: "Secagem",
    title: "Secagem Solar de Grãos",
    body: "Lonas pretas sobre plataformas elevadas secam milho e amendoim em 2 a 3 dias — prevenindo bolores e aflatoxinas.",
    tag: "Qualidade",
  },
  {
    category: "Sementes",
    title: "Variedades Resistentes à Seca",
    body: "As variedades DTMA de milho produzem até 30% mais sob stress hídrico e estão disponíveis no IIAM.",
    tag: "Produtividade",
  },
  {
    category: "Cooperativas",
    title: "Associações de Agricultores",
    body: "Junte-se a uma cooperativa local para negociar melhores preços colectivamente e aceder a crédito agrícola conjunto.",
    tag: "Negócio",
  },
  {
    category: "Integração",
    title: "Gado e Culturas em Conjunto",
    body: "Deixe o gado pastar nos campos após a colheita — fertiliza o solo naturalmente e elimina adubos químicos importados.",
    tag: "Sustentabilidade",
  },
];

// ─────────────────────────────────────────────────────────────
// SVG ICONS — inline, no deps
// ─────────────────────────────────────────────────────────────
const Ic = {
  Sprout: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 1 1.5 4.1c-1.7.1-3.1-.1-4.3-.8-1.1-.7-2-2-2.5-4.2 2.6-.6 4.2-.1 5.3.9z" />
    </svg>
  ),
  Leaf: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  MapPin: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Package: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  ),
  Phone: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Chat: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
  Swap: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </svg>
  ),
  Truck: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  ),
  Clock: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Star: ({ on }: { on: boolean }) => (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill={on ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Search: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  Grid: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  ),
  List: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  ),
  X: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  Upload: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  ),
  Check: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Alert: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  Sun: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  Droplets: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  ),
  Bug: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  ),
  Snow: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="m20 16-4-4 4-4" />
      <path d="m4 8 4 4-4 4" />
      <path d="m16 4-4 4-4-4" />
      <path d="m8 20 4-4 4 4" />
    </svg>
  ),
  Bulb: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  Chevron: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  TrendUp: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  Users: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Store: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
    </svg>
  ),
  Cal: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function timeAgo(ts: number): string {
  const d = (Date.now() - ts) / 1000;
  if (d < 60) return "agora mesmo";
  if (d < 3600) return `${Math.floor(d / 60)} min atrás`;
  if (d < 86400) return `${Math.floor(d / 3600)} h atrás`;
  return `${Math.floor(d / 86400)} d atrás`;
}

// ─────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:         #0D1A0C;
  --ink-2:       #253323;
  --ink-3:       #445741;
  --muted:       #8A9A87;
  --border:      #DCE5D8;
  --bg:          #F5F6F2;
  --surface:     #FFFFFF;
  --surface-2:   #EDF0E9;

  --green:       #1B5E36;
  --green-mid:   #27804C;
  --green-lt:    #D0E9D8;
  --green-xs:    #EAF4EE;
  --amber:       #A05C00;
  --amber-lt:    #FBF0DC;
  --red:         #8B2020;
  --red-lt:      #FDEAEA;
  --blue:        #1A4070;
  --blue-lt:     #DDE8F6;
  --purple:      #542080;
  --purple-lt:   #EDE0FA;
  --teal:        #0D6060;
  --teal-lt:     #D8F0EE;

  --ff-serif: 'Fraunces', Georgia, serif;
  --ff-sans:  'Plus Jakarta Sans', system-ui, sans-serif;
  --ff-mono:  'DM Mono', monospace;

  --r-sm: 6px; --r-md: 10px; --r-lg: 16px; --r-xl: 22px;

  --sh-sm: 0 1px 4px rgba(13,26,12,.06), 0 1px 2px rgba(13,26,12,.04);
  --sh-md: 0 4px 18px rgba(13,26,12,.09), 0 2px 6px rgba(13,26,12,.05);
  --sh-lg: 0 24px 64px rgba(13,26,12,.15), 0 8px 24px rgba(13,26,12,.08);
  --t: .17s ease;
}

html, body { background: var(--bg); }

.ag {
  font-family: var(--ff-sans);
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

/* ── NAV ── */
.ag-nav {
  background: var(--ink);
  position: sticky; top: 0; z-index: 400;
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.ag-nav-in {
  max-width: 1440px; margin: 0 auto; padding: 0 2.5rem;
  height: 62px; display: flex; align-items: center; gap: 1.75rem;
}
.ag-logo { display: flex; align-items: center; gap: 11px; flex-shrink: 0; text-decoration: none; }
.ag-logo-mark {
  width: 36px; height: 36px; border-radius: 9px;
  background: var(--green-mid); display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
}
.ag-logo-name {
  font-family: var(--ff-serif); font-size: 1.2rem; font-weight: 600;
  color: #fff; letter-spacing: -.025em;
}
.ag-logo-name b { color: #7DC35A; font-weight: 600; }
.ag-logo-tag {
  font-size: .58rem; font-weight: 600; letter-spacing: .1em;
  text-transform: uppercase; color: rgba(255,255,255,.28); margin-top: 1px;
}
.ag-nav-search {
  flex: 1; max-width: 460px; position: relative;
}
.ag-nav-search input {
  width: 100%; padding: 8px 14px 8px 38px;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.11);
  border-radius: var(--r-md); color: #fff;
  font-family: var(--ff-sans); font-size: .85rem;
  outline: none; transition: border-color var(--t), background var(--t);
}
.ag-nav-search input::placeholder { color: rgba(255,255,255,.28); }
.ag-nav-search input:focus { border-color: rgba(125,195,90,.5); background: rgba(255,255,255,.1); }
.ag-nav-si {
  position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
  color: rgba(255,255,255,.3); pointer-events: none;
}
.ag-nav-stats {
  margin-left: auto; display: flex; align-items: center; gap: 1.25rem; flex-shrink: 0;
}
.ag-nav-stat { text-align: right; }
.ag-nav-stat-n {
  font-family: var(--ff-mono); font-size: 1rem; font-weight: 500;
  color: #7DC35A; line-height: 1;
}
.ag-nav-stat-l {
  font-size: .58rem; font-weight: 700; letter-spacing: .09em;
  text-transform: uppercase; color: rgba(255,255,255,.28);
}
.ag-nav-divider { width: 1px; height: 26px; background: rgba(255,255,255,.09); }

/* ── HERO ── */
.ag-hero {
  background: var(--ink-2);
  padding: 3.75rem 2.5rem 3.25rem;
  position: relative; overflow: hidden;
}
.ag-hero-glow {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 55% 90% at 88% 50%, rgba(39,128,76,.22) 0%, transparent 65%),
    radial-gradient(ellipse 35% 55% at 5%  85%, rgba(13,26,12,.6)   0%, transparent 55%);
}
.ag-hero-in {
  max-width: 1440px; margin: 0 auto; position: relative;
  display: flex; align-items: center; justify-content: space-between; gap: 3.5rem;
}
.ag-hero-copy { max-width: 560px; }
.ag-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(125,195,90,.1); border: 1px solid rgba(125,195,90,.22);
  border-radius: 100px; padding: 5px 14px;
  font-size: .68rem; font-weight: 700; letter-spacing: .11em;
  text-transform: uppercase; color: #7DC35A; margin-bottom: 1.2rem;
}
.ag-hero-pulse {
  width: 7px; height: 7px; border-radius: 50%;
  background: #7DC35A; animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: .5; transform: scale(.8); }
}
.ag-hero-h1 {
  font-family: var(--ff-serif);
  font-size: clamp(2.1rem, 4.2vw, 3.3rem);
  font-weight: 600; line-height: 1.06;
  color: #fff; letter-spacing: -.04em;
}
.ag-hero-h1 i { font-style: italic; color: #7DC35A; }
.ag-hero-p {
  margin-top: .9rem; color: rgba(255,255,255,.5);
  font-size: .92rem; line-height: 1.75; max-width: 430px; font-weight: 300;
}
.ag-hero-chips {
  display: flex; gap: 7px; margin-top: 1.75rem; flex-wrap: wrap;
}
.ag-hero-chip {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 6px 14px;
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
  border-radius: 100px; font-size: .75rem; font-weight: 600;
  color: rgba(255,255,255,.6); cursor: pointer; transition: all var(--t);
}
.ag-hero-chip:hover { background: rgba(255,255,255,.11); color: #fff; }
.ag-hero-chip.on { background: var(--green-mid); border-color: var(--green-mid); color: #fff; }
.ag-hero-chip-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: currentColor; opacity: .8; flex-shrink: 0;
}

.ag-hero-kpis { display: flex; flex-direction: column; gap: .8rem; flex-shrink: 0; }
.ag-hero-kpi {
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
  border-radius: var(--r-lg); padding: 1.1rem 1.5rem;
  min-width: 160px; backdrop-filter: blur(6px);
  display: flex; align-items: center; gap: 12px;
  transition: border-color var(--t);
}
.ag-hero-kpi:hover { border-color: rgba(125,195,90,.3); }
.ag-hero-kpi-icon { color: #7DC35A; flex-shrink: 0; }
.ag-hero-kpi-num {
  font-family: var(--ff-mono); font-size: 1.5rem; font-weight: 500;
  color: #fff; line-height: 1;
}
.ag-hero-kpi-lbl {
  font-size: .62rem; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: rgba(255,255,255,.35); margin-top: 3px;
}

/* ── TABS ── */
.ag-tabs {
  background: var(--surface);
  border-bottom: 1.5px solid var(--border);
  position: sticky; top: 62px; z-index: 300;
}
.ag-tabs-in {
  max-width: 1440px; margin: 0 auto;
  padding: 0 2.5rem;
  display: flex; align-items: stretch;
  overflow-x: auto; scrollbar-width: none;
}
.ag-tabs-in::-webkit-scrollbar { display: none; }
.ag-tab {
  display: inline-flex; align-items: center; gap: 7px;
  padding: .85rem 1.1rem;
  font-family: var(--ff-sans); font-size: .8rem; font-weight: 600; letter-spacing: .01em;
  color: var(--muted); background: none; border: none;
  border-bottom: 2.5px solid transparent;
  cursor: pointer; white-space: nowrap; flex-shrink: 0;
  transition: color var(--t), border-color var(--t);
}
.ag-tab svg { opacity: .6; transition: opacity var(--t); }
.ag-tab:hover { color: var(--ink-2); }
.ag-tab:hover svg { opacity: .8; }
.ag-tab.on { color: var(--green); border-bottom-color: var(--green); }
.ag-tab.on svg { opacity: 1; }
.ag-tab-badge {
  background: var(--red); color: #fff;
  border-radius: 100px; padding: 2px 6px;
  font-size: .6rem; font-weight: 700; min-width: 18px; text-align: center;
}
.ag-tab-count {
  background: var(--surface-2); color: var(--muted);
  border-radius: 100px; padding: 2px 7px;
  font-size: .62rem; font-weight: 700;
}
.ag-tab.on .ag-tab-count { background: var(--green-lt); color: var(--green); }

/* ── MAIN ── */
.ag-main { max-width: 1440px; margin: 0 auto; padding: 2.25rem 2.5rem; }
.ag-two-col {
  display: grid; grid-template-columns: 1fr 372px; gap: 2.5rem; align-items: start;
}
@media (max-width: 1100px) {
  .ag-two-col { grid-template-columns: 1fr; }
  .ag-hero-kpis, .ag-nav-stats { display: none; }
}

/* ── SECTION HEADER ── */
.ag-sec-hd {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 1.25rem; gap: 1rem;
}
.ag-sec-title {
  font-family: var(--ff-serif); font-size: 1.45rem; font-weight: 600;
  color: var(--ink); letter-spacing: -.025em;
}
.ag-sec-meta { font-size: .75rem; color: var(--muted); font-weight: 600; }

/* ── TOOLBAR ── */
.ag-toolbar { display: flex; gap: 7px; margin-bottom: 1.4rem; flex-wrap: wrap; align-items: center; }
.ag-chip {
  padding: 5px 13px;
  border: 1.5px solid var(--border); border-radius: 100px;
  background: var(--surface); font-family: var(--ff-sans);
  font-size: .75rem; font-weight: 600; color: var(--ink-3);
  cursor: pointer; transition: all var(--t); white-space: nowrap;
}
.ag-chip:hover { border-color: var(--green); color: var(--green); }
.ag-chip.on { background: var(--green); border-color: var(--green); color: #fff; }
.ag-toolbar-r { margin-left: auto; display: flex; gap: 6px; align-items: center; }
.ag-select {
  padding: 6px 10px;
  border: 1.5px solid var(--border); border-radius: var(--r-sm);
  background: var(--surface); color: var(--ink-3);
  font-family: var(--ff-sans); font-size: .75rem; font-weight: 600;
  cursor: pointer; outline: none; transition: border-color var(--t);
}
.ag-select:focus { border-color: var(--green); }
.ag-icon-btn {
  width: 32px; height: 32px;
  border: 1.5px solid var(--border); border-radius: var(--r-sm);
  background: var(--surface); color: var(--muted);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all var(--t);
}
.ag-icon-btn:hover { border-color: var(--green); color: var(--green); }
.ag-icon-btn.on { background: var(--ink); border-color: var(--ink); color: #fff; }

/* ── PRODUCT GRID ── */
.ag-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(264px,1fr)); gap: 1.1rem; }
.ag-grid-list { grid-template-columns: 1fr; }

/* ── CARD ── */
.ag-card {
  background: var(--surface); border-radius: var(--r-lg);
  border: 1.5px solid var(--border); box-shadow: var(--sh-sm);
  overflow: hidden; cursor: pointer; position: relative;
  transition: transform var(--t), box-shadow var(--t), border-color var(--t);
}
.ag-card:hover { transform: translateY(-3px); box-shadow: var(--sh-md); border-color: #C0D4BA; }
.ag-card-list { display: grid; grid-template-columns: 192px 1fr; }
.ag-card-list .ag-card-img { height: auto; min-height: 156px; border-radius: var(--r-lg) 0 0 var(--r-lg); }

.ag-card-flags {
  position: absolute; top: 9px; right: 9px;
  display: flex; flex-direction: column; gap: 4px; z-index: 2;
}
.ag-flag {
  display: inline-flex; align-items: center; gap: 4px;
  border-radius: 5px; padding: 3px 8px;
  font-size: .6rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
}
.ag-flag-o { background: var(--green-lt); color: var(--green); }
.ag-flag-b { background: var(--amber-lt); color: var(--amber); }
.ag-flag-t { background: var(--blue-lt);  color: var(--blue);  }

.ag-card-img {
  height: 194px; background: var(--surface-2); overflow: hidden; position: relative;
}
.ag-card-img img {
  width: 100%; height: 100%; object-fit: cover; transition: transform .38s ease; display: block;
}
.ag-card:hover .ag-card-img img { transform: scale(1.05); }
.ag-card-img-ph {
  height: 100%; display: flex; align-items: center; justify-content: center;
}
.ag-card-img-ph-inner {
  width: 52px; height: 52px; border-radius: 50%;
  background: rgba(255,255,255,.8);
  display: flex; align-items: center; justify-content: center;
}
.ag-card-cat-strip {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 5px 10px;
  background: linear-gradient(transparent, rgba(13,26,12,.5));
  display: flex; align-items: center; gap: 6px;
}
.ag-card-cat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.ag-card-cat-lbl {
  font-size: .63rem; font-weight: 700; letter-spacing: .07em;
  text-transform: uppercase; color: rgba(255,255,255,.88);
}

.ag-card-body { padding: 15px 17px 17px; }
.ag-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.ag-card-name {
  font-family: var(--ff-serif); font-size: 1.05rem; font-weight: 600;
  color: var(--ink); line-height: 1.2; letter-spacing: -.02em;
}
.ag-card-price-blk { text-align: right; flex-shrink: 0; }
.ag-card-price {
  font-family: var(--ff-mono); font-size: 1.1rem; font-weight: 500;
  color: var(--green); line-height: 1;
}
.ag-card-unit {
  font-size: .6rem; font-weight: 700; letter-spacing: .06em;
  text-transform: uppercase; color: var(--muted); margin-top: 2px;
}
.ag-stars { display: flex; align-items: center; gap: 2px; margin-top: 5px; color: var(--amber); }
.ag-stars-n { font-size: .68rem; color: var(--muted); margin-left: 4px; font-family: var(--ff-mono); }

.ag-card-rule { height: 1px; background: var(--border); margin: 11px 0; }

.ag-card-meta { display: flex; flex-direction: column; gap: 4px; }
.ag-card-meta-row {
  display: flex; align-items: center; gap: 7px;
  font-size: .76rem; color: var(--ink-3); font-weight: 500;
}
.ag-meta-icon {
  width: 20px; height: 20px; border-radius: 5px;
  background: var(--surface-2); display: flex; align-items: center; justify-content: center;
  color: var(--muted); flex-shrink: 0;
}
.ag-card-ts {
  display: flex; align-items: center; gap: 5px;
  font-size: .66rem; color: var(--muted); margin-top: 9px;
}
.ag-card-cta {
  width: 100%; margin-top: 12px; padding: 9px 14px;
  background: var(--ink); color: #fff; border: none;
  border-radius: var(--r-md); font-family: var(--ff-sans);
  font-size: .77rem; font-weight: 700; cursor: pointer; letter-spacing: .01em;
  transition: background var(--t); display: flex; align-items: center; justify-content: center; gap: 5px;
}
.ag-card-cta:hover { background: var(--green); }

/* ── EMPTY ── */
.ag-empty {
  grid-column: 1/-1; padding: 5rem 2rem; text-align: center;
  border: 1.5px dashed var(--border); border-radius: var(--r-xl);
}
.ag-empty-ico {
  width: 52px; height: 52px; border-radius: 14px; background: var(--surface-2);
  display: flex; align-items: center; justify-content: center;
  color: var(--muted); margin: 0 auto 1rem;
}
.ag-empty-t { font-family: var(--ff-serif); font-size: 1.05rem; color: var(--ink-3); }
.ag-empty-s { font-size: .8rem; color: var(--muted); margin-top: 4px; }

/* ── FORM PANEL ── */
.ag-panel {
  background: var(--ink); border-radius: var(--r-xl); padding: 1.6rem;
  position: sticky; top: 122px;
}
.ag-panel-title {
  font-family: var(--ff-serif); font-size: 1.25rem; font-weight: 600;
  color: #fff; letter-spacing: -.02em;
}
.ag-panel-sub { font-size: .76rem; color: rgba(255,255,255,.32); margin-top: 3px; }
.ag-panel-rule { height: 1px; background: rgba(255,255,255,.07); margin: 1.1rem 0; }

.ag-field { margin-bottom: .85rem; }
.ag-label {
  display: block; font-size: .65rem; font-weight: 700;
  color: rgba(255,255,255,.38); text-transform: uppercase;
  letter-spacing: .09em; margin-bottom: 5px;
}
.ag-input {
  width: 100%; padding: 9px 11px;
  border-radius: var(--r-md); border: 1.5px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05); color: #fff;
  font-family: var(--ff-sans); font-size: .85rem;
  outline: none; transition: border-color var(--t), background var(--t);
  appearance: none;
}
.ag-input::placeholder { color: rgba(255,255,255,.18); }
.ag-input:focus { border-color: rgba(125,195,90,.45); background: rgba(255,255,255,.08); }
.ag-input option { background: #1A3020; color: #fff; }
.ag-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }

.ag-upload {
  border: 1.5px dashed rgba(255,255,255,.14); border-radius: var(--r-md);
  height: 112px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; text-align: center; position: relative; overflow: hidden;
  transition: border-color var(--t), background var(--t);
  background: rgba(255,255,255,.02);
}
.ag-upload:hover { border-color: rgba(255,255,255,.28); background: rgba(255,255,255,.04); }
.ag-upload.drag { border-color: #7DC35A; background: rgba(125,195,90,.07); }
.ag-upload img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: calc(var(--r-md) - 2px); }
.ag-upload-inner { pointer-events: none; }
.ag-upload-ico { color: rgba(255,255,255,.28); margin-bottom: 7px; }
.ag-upload-hint { font-size: .7rem; color: rgba(255,255,255,.22); line-height: 1.6; }
.ag-upload-hint b { color: #7DC35A; font-weight: 600; }

.ag-toggles { display: flex; flex-direction: column; gap: 5px; margin-bottom: .85rem; }
.ag-toggle {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 11px; border-radius: var(--r-md);
  border: 1.5px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03);
  cursor: pointer; transition: border-color var(--t);
}
.ag-toggle:hover { border-color: rgba(255,255,255,.17); }
.ag-tgl-lbl { font-size: .78rem; color: rgba(255,255,255,.62); font-weight: 500; }
.ag-tgl-sub { font-size: .66rem; color: rgba(255,255,255,.28); display: block; margin-top: 1px; }
.ag-switch {
  width: 34px; height: 19px; border-radius: 100px;
  background: rgba(255,255,255,.14); position: relative;
  transition: background var(--t); flex-shrink: 0;
}
.ag-switch.on { background: #7DC35A; }
.ag-switch::after {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 13px; height: 13px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.2);
  transition: transform var(--t);
}
.ag-switch.on::after { transform: translateX(15px); }

.ag-btn-primary {
  width: 100%; padding: 11px;
  background: #7DC35A; color: var(--ink); border: none;
  border-radius: var(--r-md); font-family: var(--ff-sans);
  font-size: .85rem; font-weight: 700; cursor: pointer; letter-spacing: .01em;
  transition: background var(--t), transform var(--t);
  display: flex; align-items: center; justify-content: center; gap: 6px;
  margin-top: .25rem;
}
.ag-btn-primary:hover { background: #6BB049; }
.ag-btn-primary:active { transform: scale(.98); }

/* ── ALERTS ── */
.ag-alerts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px,1fr)); gap: 1.1rem; }
.ag-alert {
  background: var(--surface); border-radius: var(--r-lg);
  border: 1.5px solid var(--border); box-shadow: var(--sh-sm);
  padding: 1.3rem; border-left-width: 4px;
}
.ag-alert-hd { display: flex; align-items: center; gap: 9px; margin-bottom: 9px; }
.ag-alert-ico {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ag-alert-prov { font-family: var(--ff-serif); font-size: .95rem; font-weight: 600; color: var(--ink); }
.ag-alert-type-tag {
  margin-left: auto; font-size: .6rem; font-weight: 700; letter-spacing: .07em;
  text-transform: uppercase; padding: 3px 8px; border-radius: 5px;
}
.ag-alert-hl {
  font-family: var(--ff-serif); font-size: .9rem; font-weight: 600;
  color: var(--ink); margin-bottom: 5px; letter-spacing: -.01em;
}
.ag-alert-detail { font-size: .8rem; color: var(--ink-3); line-height: 1.6; }
.ag-alert-sev {
  display: flex; align-items: center; gap: 6px;
  margin-top: 11px; font-size: .68rem; font-weight: 700;
  letter-spacing: .06em; text-transform: uppercase;
}
.ag-sev-dot { width: 7px; height: 7px; border-radius: 50%; }

/* ── TIPS ── */
.ag-tips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(272px,1fr)); gap: 1.1rem; }
.ag-tip {
  background: var(--surface); border-radius: var(--r-lg);
  border: 1.5px solid var(--border); box-shadow: var(--sh-sm);
  padding: 1.4rem; transition: transform var(--t), box-shadow var(--t);
}
.ag-tip:hover { transform: translateY(-3px); box-shadow: var(--sh-md); }
.ag-tip-ico {
  width: 40px; height: 40px; border-radius: 11px;
  background: var(--green-xs); color: var(--green);
  display: flex; align-items: center; justify-content: center; margin-bottom: .9rem;
}
.ag-tip-cat {
  font-size: .6rem; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 4px;
  display: flex; align-items: center; gap: 5px;
}
.ag-tip-cat-bar { width: 3px; height: 9px; background: var(--green); border-radius: 2px; }
.ag-tip-title {
  font-family: var(--ff-serif); font-size: .95rem; font-weight: 600;
  color: var(--ink); margin-bottom: 5px; letter-spacing: -.01em;
}
.ag-tip-body { font-size: .8rem; color: var(--ink-3); line-height: 1.65; }
.ag-tip-tag {
  display: inline-block; margin-top: 11px;
  font-size: .6rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase;
  padding: 3px 8px; border-radius: 5px;
  background: var(--surface-2); color: var(--muted);
}

/* ── BARTER ── */
.ag-barter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px,1fr)); gap: 1.1rem; }
.ag-barter {
  background: var(--surface); border-radius: var(--r-lg);
  border: 1.5px solid var(--border); box-shadow: var(--sh-sm);
  overflow: hidden; transition: transform var(--t), box-shadow var(--t);
}
.ag-barter:hover { transform: translateY(-3px); box-shadow: var(--sh-md); }
.ag-barter-hd {
  background: var(--ink-2); padding: 1rem 1.2rem;
  display: flex; align-items: center; gap: 11px;
}
.ag-barter-hd-ico {
  width: 38px; height: 38px; border-radius: 9px;
  background: rgba(255,255,255,.08);
  display: flex; align-items: center; justify-content: center; color: #7DC35A;
}
.ag-barter-hd-name { font-family: var(--ff-serif); font-weight: 600; font-size: .95rem; color: #fff; }
.ag-barter-hd-loc { font-size: .68rem; color: rgba(255,255,255,.4); margin-top: 1px; }
.ag-barter-body { padding: 1rem 1.2rem; }
.ag-barter-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 4px 0; border-bottom: 1px solid var(--border);
}
.ag-barter-row:last-of-type { border-bottom: none; }
.ag-barter-lbl { font-size: .67rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
.ag-barter-val { font-size: .8rem; font-weight: 600; color: var(--ink); font-family: var(--ff-mono); }
.ag-barter-wants {
  margin-top: 9px; padding: 9px 11px;
  background: var(--amber-lt); border-radius: var(--r-sm);
  font-size: .77rem; color: var(--amber); font-weight: 600;
  display: flex; align-items: flex-start; gap: 7px;
}
.ag-barter-wants-ico { flex-shrink: 0; margin-top: 1px; }
.ag-barter-cta {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: calc(100% - 2.4rem); margin: 0 1.2rem 1.2rem;
  padding: 9px; background: var(--green); color: #fff; border: none;
  border-radius: var(--r-md); font-family: var(--ff-sans);
  font-size: .77rem; font-weight: 700; cursor: pointer; transition: background var(--t);
}
.ag-barter-cta:hover { background: var(--ink-2); }

/* ── MODAL ── */
.ag-modal-bg {
  position: fixed; inset: 0; background: rgba(13,26,12,.72);
  z-index: 1000; display: flex; align-items: center; justify-content: center;
  padding: 1.5rem; backdrop-filter: blur(5px);
}
.ag-modal {
  background: var(--surface); border-radius: var(--r-xl);
  max-width: 540px; width: 100%; max-height: 90vh; overflow-y: auto;
  box-shadow: var(--sh-lg); position: relative;
  animation: mIn .2s ease;
}
@keyframes mIn {
  from { opacity: 0; transform: scale(.96) translateY(6px); }
  to   { opacity: 1; transform: scale(1)   translateY(0);   }
}
.ag-modal-img { width: 100%; height: 250px; object-fit: cover; border-radius: var(--r-xl) var(--r-xl) 0 0; display: block; }
.ag-modal-img-ph {
  height: 210px; background: var(--surface-2);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  display: flex; align-items: center; justify-content: center;
}
.ag-modal-close {
  position: absolute; top: 12px; right: 12px;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(13,26,12,.5); border: none; color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; backdrop-filter: blur(4px); transition: background var(--t); z-index: 2;
}
.ag-modal-close:hover { background: rgba(13,26,12,.78); }
.ag-modal-body { padding: 1.6rem; }
.ag-modal-name {
  font-family: var(--ff-serif); font-size: 1.55rem; font-weight: 600;
  color: var(--ink); letter-spacing: -.03em;
}
.ag-modal-price {
  font-family: var(--ff-mono); font-size: 1.65rem; color: var(--green);
  font-weight: 500; margin-top: 2px; line-height: 1;
}
.ag-modal-price span { font-size: .82rem; color: var(--muted); font-weight: 400; }
.ag-modal-flags { display: flex; gap: 6px; margin: 12px 0; flex-wrap: wrap; }
.ag-modal-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 1.1rem 0;
}
.ag-modal-cell {
  background: var(--surface-2); border-radius: var(--r-md); padding: 9px 11px;
}
.ag-modal-cell-l {
  font-size: .62rem; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 2px;
  display: flex; align-items: center; gap: 4px;
}
.ag-modal-cell-v { font-size: .85rem; font-weight: 600; color: var(--ink); }
.ag-modal-actions { display: flex; gap: 9px; margin-top: 1.4rem; }
.ag-btn-call {
  flex: 1; padding: 11px; background: var(--green); color: #fff; border: none;
  border-radius: var(--r-md); font-family: var(--ff-sans);
  font-size: .85rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: background var(--t);
}
.ag-btn-call:hover { background: var(--ink-2); }
.ag-btn-wa {
  flex: 1; padding: 11px; background: var(--surface-2); color: var(--ink); border: none;
  border-radius: var(--r-md); font-family: var(--ff-sans);
  font-size: .85rem; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: background var(--t);
}
.ag-btn-wa:hover { background: var(--border); }

/* ── TOAST ── */
.ag-toast {
  position: fixed; bottom: 2rem; right: 2rem;
  background: var(--ink); color: #fff;
  padding: 12px 18px; border-radius: var(--r-md);
  font-size: .8rem; font-weight: 600;
  box-shadow: var(--sh-lg);
  display: flex; align-items: center; gap: 8px;
  animation: tIn .22s ease; z-index: 9999;
  border-left: 3px solid #7DC35A;
}
@keyframes tIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0);    }
}
.ag-toast-check {
  width: 20px; height: 20px; border-radius: 50%;
  background: #7DC35A; display: flex; align-items: center; justify-content: center;
  color: var(--ink); flex-shrink: 0;
}

/* ── FOOTER ── */
.ag-footer { background: var(--ink); padding: 2.5rem; margin-top: 4rem; }
.ag-footer-in {
  max-width: 1440px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;
}
.ag-footer-brand {
  font-family: var(--ff-serif); font-size: 1.05rem; font-weight: 600;
  color: #fff; letter-spacing: -.02em;
}
.ag-footer-brand span { color: #7DC35A; }
.ag-footer-sub { font-size: .68rem; color: rgba(255,255,255,.28); margin-top: 3px; }
.ag-footer-links { display: flex; gap: 2rem; }
.ag-footer-link {
  font-size: .75rem; color: rgba(255,255,255,.32); text-decoration: none;
  font-weight: 500; transition: color var(--t);
}
.ag-footer-link:hover { color: rgba(255,255,255,.68); }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .ag-nav-in { padding: 0 1.25rem; }
  .ag-hero   { padding: 2.5rem 1.25rem 2rem; }
  .ag-tabs-in, .ag-main { padding-left: 1.25rem; padding-right: 1.25rem; }
  .ag-grid   { grid-template-columns: 1fr; }
  .ag-modal-grid { grid-template-columns: 1fr; }
  .ag-footer { padding: 2rem 1.25rem; }
  .ag-footer-in { flex-direction: column; }
}
`;

// ─────────────────────────────────────────────────────────────
// PRODUCT CARD COMPONENT
// ─────────────────────────────────────────────────────────────
function ProductCard({
  p,
  onOpen,
  listView,
}: {
  p: Product;
  onOpen: () => void;
  listView: boolean;
}) {
  const cc = CAT_COLOR[p.category] ?? "#5A5A5A";
  return (
    <article
      className={`ag-card${listView ? " ag-card-list" : ""}`}
      onClick={onOpen}
    >
      <div className="ag-card-flags">
        {p.organic && (
          <span className="ag-flag ag-flag-o">
            <Ic.Leaf />
            Orgânico
          </span>
        )}
        {p.barter && (
          <span className="ag-flag ag-flag-b">
            <Ic.Swap />
            Troca
          </span>
        )}
        {p.transport && (
          <span className="ag-flag ag-flag-t">
            <Ic.Truck />
            Entrega
          </span>
        )}
      </div>
      <div className="ag-card-img">
        {p.image ? (
          <img src={p.image} alt={p.name} loading="lazy" />
        ) : (
          <div className="ag-card-img-ph">
            <div className="ag-card-img-ph-inner" style={{ color: cc }}>
              <Ic.Sprout />
            </div>
          </div>
        )}
        <div className="ag-card-cat-strip">
          <div className="ag-card-cat-dot" style={{ background: cc }} />
          <span className="ag-card-cat-lbl">{p.category}</span>
        </div>
      </div>
      <div className="ag-card-body">
        <div className="ag-card-top">
          <div className="ag-card-name">{p.name}</div>
          <div className="ag-card-price-blk">
            <div className="ag-card-price">
              {p.price.toLocaleString("pt-MZ")}
            </div>
            <div className="ag-card-unit">MZN / {p.unit}</div>
          </div>
        </div>
        {p.rating && (
          <div className="ag-stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                style={{
                  color: i <= Math.round(p.rating!) ? "#A05C00" : "#DCE5D8",
                }}
              >
                <Ic.Star on={i <= Math.round(p.rating!)} />
              </span>
            ))}
            <span className="ag-stars-n">{p.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="ag-card-rule" />
        <div className="ag-card-meta">
          <div className="ag-card-meta-row">
            <div className="ag-meta-icon">
              <Ic.MapPin />
            </div>
            {p.location}, {p.province}
          </div>
          <div className="ag-card-meta-row">
            <div className="ag-meta-icon">
              <Ic.Package />
            </div>
            {p.quantity} {p.unit} disponíveis
          </div>
        </div>
        <div className="ag-card-ts">
          <Ic.Clock />
          {timeAgo(p.postedAt)}
        </div>
        <button
          className="ag-card-cta"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          Ver detalhes e contactar <Ic.Chevron />
        </button>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// MODAL COMPONENT
// ─────────────────────────────────────────────────────────────
function ProductModal({ p, onClose }: { p: Product; onClose: () => void }) {
  const cc = CAT_COLOR[p.category] ?? "#5A5A5A";
  return (
    <div className="ag-modal-bg" onClick={onClose}>
      <div className="ag-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ag-modal-close" onClick={onClose}>
          <Ic.X />
        </button>
        {p.image ? (
          <img src={p.image} alt={p.name} className="ag-modal-img" />
        ) : (
          <div className="ag-modal-img-ph">
            <div style={{ color: cc }}>
              <Ic.Sprout />
            </div>
          </div>
        )}
        <div className="ag-modal-body">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div>
              <div className="ag-modal-name">{p.name}</div>
              <div className="ag-modal-price">
                {p.price.toLocaleString("pt-MZ")} <span>MZN / {p.unit}</span>
              </div>
            </div>
            <span
              className="ag-flag"
              style={{
                background: cc + "18",
                color: cc,
                flexShrink: 0,
                marginTop: 4,
                border: `1px solid ${cc}30`,
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: ".62rem",
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              {p.category}
            </span>
          </div>
          <div className="ag-modal-flags">
            {p.organic && (
              <span className="ag-flag ag-flag-o">
                <Ic.Leaf />
                Orgânico
              </span>
            )}
            {p.barter && (
              <span className="ag-flag ag-flag-b">
                <Ic.Swap />
                Aceita Troca
              </span>
            )}
            {p.transport && (
              <span className="ag-flag ag-flag-t">
                <Ic.Truck />
                Transporte Disponível
              </span>
            )}
          </div>
          <div className="ag-modal-grid">
            <div className="ag-modal-cell">
              <div className="ag-modal-cell-l">
                <Ic.MapPin />
                Localização
              </div>
              <div className="ag-modal-cell-v">
                {p.location}, {p.province}
              </div>
            </div>
            <div className="ag-modal-cell">
              <div className="ag-modal-cell-l">
                <Ic.Package />
                Quantidade
              </div>
              <div className="ag-modal-cell-v">
                {p.quantity} {p.unit}
              </div>
            </div>
            <div className="ag-modal-cell">
              <div className="ag-modal-cell-l">
                <Ic.Phone />
                Contacto
              </div>
              <div className="ag-modal-cell-v">{p.contact}</div>
            </div>
            <div className="ag-modal-cell">
              <div className="ag-modal-cell-l">
                <Ic.Clock />
                Publicado
              </div>
              <div className="ag-modal-cell-v">{timeAgo(p.postedAt)}</div>
            </div>
            {p.harvestDate && (
              <div className="ag-modal-cell">
                <div className="ag-modal-cell-l">
                  <Ic.Cal />
                  Colheita
                </div>
                <div className="ag-modal-cell-v">{p.harvestDate}</div>
              </div>
            )}
            {p.barterFor && (
              <div className="ag-modal-cell" style={{ gridColumn: "1/-1" }}>
                <div className="ag-modal-cell-l">
                  <Ic.Swap />
                  Aceita em Troca
                </div>
                <div className="ag-modal-cell-v">{p.barterFor}</div>
              </div>
            )}
          </div>
          <div className="ag-modal-actions">
            <button
              className="ag-btn-call"
              onClick={() =>
                window.open(`tel:${p.contact.replace(/\s/g, "")}`, "_self")
              }
            >
              <Ic.Phone />
              Ligar Agora
            </button>
            <button
              className="ag-btn-wa"
              onClick={() =>
                window.open(
                  `https://wa.me/258${p.contact.replace(/\s/g, "").replace(/^0/, "")}`,
                  "_blank",
                )
              }
            >
              <Ic.Chat />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ALERTS TAB COMPONENT
// ─────────────────────────────────────────────────────────────
function AlertsTab() {
  const meta: Record<
    AlertType,
    { color: string; bg: string; icon: JSX.Element; label: string }
  > = {
    drought: {
      color: "#A05C00",
      bg: "#FBF0DC",
      icon: <Ic.Sun />,
      label: "Seca",
    },
    flood: {
      color: "#1A4070",
      bg: "#DDE8F6",
      icon: <Ic.Droplets />,
      label: "Cheias",
    },
    pest: {
      color: "#542080",
      bg: "#EDE0FA",
      icon: <Ic.Bug />,
      label: "Pragas",
    },
    frost: {
      color: "#0D6060",
      bg: "#D8F0EE",
      icon: <Ic.Snow />,
      label: "Geada",
    },
  };
  const sevMeta = {
    low: { c: "#1B5E36", l: "Risco Baixo" },
    medium: { c: "#A05C00", l: "Risco Médio" },
    high: { c: "#8B2020", l: "Risco Alto" },
  };
  return (
    <div>
      <div className="ag-sec-hd">
        <h2 className="ag-sec-title">Alertas Climáticos e de Pragas</h2>
        <span className="ag-sec-meta">Actualizado hoje</span>
      </div>
      <p
        style={{
          maxWidth: 600,
          fontSize: ".855rem",
          color: "var(--ink-3)",
          lineHeight: 1.7,
          marginBottom: "1.5rem",
        }}
      >
        Informação agronómica por província — preparação antecipada reduz perdas
        de colheita até 60%.
      </p>
      <div className="ag-alerts-grid">
        {ALERTS.map((a, i) => {
          const m = meta[a.type];
          const s = sevMeta[a.severity];
          return (
            <div
              key={i}
              className="ag-alert"
              style={{ borderLeftColor: m.color }}
            >
              <div className="ag-alert-hd">
                <div
                  className="ag-alert-ico"
                  style={{ background: m.bg, color: m.color }}
                >
                  {m.icon}
                </div>
                <span className="ag-alert-prov">{a.province}</span>
                <span
                  className="ag-alert-type-tag"
                  style={{ background: m.bg, color: m.color }}
                >
                  {m.label}
                </span>
              </div>
              <div className="ag-alert-hl">{a.headline}</div>
              <div className="ag-alert-detail">{a.detail}</div>
              <div className="ag-alert-sev">
                <div className="ag-sev-dot" style={{ background: s.c }} />
                <span style={{ color: s.c }}>{s.l}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TIPS TAB COMPONENT
// ─────────────────────────────────────────────────────────────
function TipsTab() {
  return (
    <div>
      <div className="ag-sec-hd">
        <h2 className="ag-sec-title">Dicas para Agricultores</h2>
        <span className="ag-sec-meta">Adaptadas ao contexto moçambicano</span>
      </div>
      <p
        style={{
          maxWidth: 600,
          fontSize: ".855rem",
          color: "var(--ink-3)",
          lineHeight: 1.7,
          marginBottom: "1.5rem",
        }}
      >
        Técnicas de baixo custo e alto impacto — sem electricidade, sem
        importações caras.
      </p>
      <div className="ag-tips-grid">
        {TIPS.map((t, i) => (
          <div key={i} className="ag-tip">
            <div className="ag-tip-ico">
              <Ic.Bulb />
            </div>
            <div className="ag-tip-cat">
              <div className="ag-tip-cat-bar" />
              {t.category}
            </div>
            <div className="ag-tip-title">{t.title}</div>
            <div className="ag-tip-body">{t.body}</div>
            <span className="ag-tip-tag">{t.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function AgroMarketMZ() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [listView, setListView] = useState(false);
  const [toast, setToast] = useState(false);
  const [tab, setTab] = useState<Tab>("mercado");
  const [modal, setModal] = useState<Product | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [imgPrev, setImgPrev] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "kg",
    quantity: "",
    location: "",
    province: "",
    contact: "",
    category: "" as Category | "",
    harvestDate: "",
    image: "",
    organic: false,
    barter: false,
    barterFor: "",
    transport: false,
  });

  useEffect(() => {
    const s = localStorage.getItem("agro_v4");
    setProducts(s ? JSON.parse(s) : DEFAULT_PRODUCTS);
  }, []);
  useEffect(() => {
    if (products.length)
      localStorage.setItem("agro_v4", JSON.stringify(products));
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const byCat = filter ? p.category === filter : true;
      const byTxt = search
        ? [p.name, p.province, p.location].some((s) =>
            s.toLowerCase().includes(search.toLowerCase()),
          )
        : true;
      return byCat && byTxt;
    });
    if (sortBy === "price_asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating")
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "recent")
      list = [...list].sort((a, b) => b.postedAt - a.postedAt);
    return list;
  }, [products, filter, search, sortBy]);

  const barterList = useMemo(
    () => products.filter((p) => p.barter),
    [products],
  );

  function uploadImg(file: File) {
    if (!file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => {
      const b = e.target?.result as string;
      setForm((f) => ({ ...f, image: b }));
      setImgPrev(b);
    };
    r.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.name ||
      !form.price ||
      !form.location ||
      !form.contact ||
      !form.category ||
      !form.province
    )
      return;
    const np: Product = {
      id: Date.now().toString(),
      name: form.name.trim(),
      price: Number(form.price),
      unit: form.unit,
      quantity: Number(form.quantity) || 1,
      location: form.location.trim(),
      province: form.province,
      contact: form.contact.trim(),
      category: form.category as Category,
      image: form.image || undefined,
      harvestDate: form.harvestDate || undefined,
      organic: form.organic,
      barter: form.barter,
      barterFor: form.barterFor || undefined,
      transport: form.transport,
      postedAt: Date.now(),
    };
    setProducts((prev) => [np, ...prev]);
    setForm({
      name: "",
      price: "",
      unit: "kg",
      quantity: "",
      location: "",
      province: "",
      contact: "",
      category: "",
      harvestDate: "",
      image: "",
      organic: false,
      barter: false,
      barterFor: "",
      transport: false,
    });
    setImgPrev(null);
    setToast(true);
    setTab("mercado");
    setTimeout(() => setToast(false), 3500);
  }

  function tog(k: "organic" | "barter" | "transport") {
    setForm((f) => ({ ...f, [k]: !f[k] }));
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="ag">
        {/* ── NAV ── */}
        <nav className="ag-nav">
          <div className="ag-nav-in">
            <div className="ag-logo">
              <div className="ag-logo-mark">
                <Ic.Sprout />
              </div>
              <div>
                <div className="ag-logo-name">
                  AgroMarket <b>MZ</b>
                </div>
                <div className="ag-logo-tag">Mercado Agrícola Nacional</div>
              </div>
            </div>
            <div className="ag-nav-search">
              <span className="ag-nav-si">
                <Ic.Search />
              </span>
              <input
                type="text"
                placeholder="Pesquise produtos, províncias, localidades…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="ag-nav-stats">
              <div className="ag-nav-stat">
                <div className="ag-nav-stat-n">{products.length}</div>
                <div className="ag-nav-stat-l">Anúncios</div>
              </div>
              <div className="ag-nav-divider" />
              <div className="ag-nav-stat">
                <div className="ag-nav-stat-n">{barterList.length}</div>
                <div className="ag-nav-stat-l">Trocas</div>
              </div>
              <div className="ag-nav-divider" />
              <div className="ag-nav-stat">
                <div className="ag-nav-stat-n">
                  {products.filter((p) => p.organic).length}
                </div>
                <div className="ag-nav-stat-l">Orgânicos</div>
              </div>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="ag-hero">
          <div className="ag-hero-glow" />
          <div className="ag-hero-in">
            <div className="ag-hero-copy">
              <div className="ag-hero-eyebrow">
                <span className="ag-hero-pulse" />
                Plataforma Agrícola de Moçambique
              </div>
              <h1 className="ag-hero-h1">
                Ligue <i>agricultores</i>
                <br />
                aos mercados nacionais
              </h1>
              <p className="ag-hero-p">
                Compre e venda produtos agrícolas directamente. Sem
                intermediários, preços em Meticais, cobertura nas onze
                províncias.
              </p>
              <div className="ag-hero-chips">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`ag-hero-chip${filter === cat ? " on" : ""}`}
                    onClick={() => {
                      setFilter(filter === cat ? "" : cat);
                      setTab("mercado");
                    }}
                  >
                    <span
                      className="ag-hero-chip-dot"
                      style={{ background: CAT_COLOR[cat] }}
                    />
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="ag-hero-kpis">
              <div className="ag-hero-kpi">
                <div className="ag-hero-kpi-icon">
                  <Ic.Store />
                </div>
                <div>
                  <div className="ag-hero-kpi-num">{products.length}</div>
                  <div className="ag-hero-kpi-lbl">Produtos activos</div>
                </div>
              </div>
              <div className="ag-hero-kpi">
                <div className="ag-hero-kpi-icon">
                  <Ic.Users />
                </div>
                <div>
                  <div className="ag-hero-kpi-num">{PROVINCES.length}</div>
                  <div className="ag-hero-kpi-lbl">Províncias</div>
                </div>
              </div>
              <div className="ag-hero-kpi">
                <div className="ag-hero-kpi-icon">
                  <Ic.TrendUp />
                </div>
                <div>
                  <div className="ag-hero-kpi-num">{barterList.length}</div>
                  <div className="ag-hero-kpi-lbl">Troca directa</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
        <div className="ag-tabs">
          <div className="ag-tabs-in">
            {(
              [
                { key: "mercado", label: "Mercado", count: products.length },
                {
                  key: "trocas",
                  label: "Troca Directa",
                  count: barterList.length,
                },
                {
                  key: "alertas",
                  label: "Alertas Climáticos",
                  badge: ALERTS.filter((a) => a.severity === "high").length,
                },
                { key: "dicas", label: "Dicas Agrícolas", count: TIPS.length },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                className={`ag-tab${tab === t.key ? " on" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.key === "mercado" && <Ic.Package />}
                {t.key === "trocas" && <Ic.Swap />}
                {t.key === "alertas" && <Ic.Alert />}
                {t.key === "dicas" && <Ic.Bulb />}
                {t.label}
                {"badge" in t && t.badge ? (
                  <span className="ag-tab-badge">{t.badge}</span>
                ) : null}
                {"count" in t && t.count !== undefined ? (
                  <span className="ag-tab-count">{t.count}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN ── */}
        <main className="ag-main">
          {/* MERCADO */}
          {tab === "mercado" && (
            <div className="ag-two-col">
              <div>
                <div className="ag-sec-hd">
                  <h2 className="ag-sec-title">Produtos Disponíveis</h2>
                  <span className="ag-sec-meta">
                    {filtered.length} resultado
                    {filtered.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="ag-toolbar">
                  <button
                    className={`ag-chip${!filter ? " on" : ""}`}
                    onClick={() => setFilter("")}
                  >
                    Todos
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      className={`ag-chip${filter === cat ? " on" : ""}`}
                      onClick={() => setFilter(filter === cat ? "" : cat)}
                    >
                      {cat}
                    </button>
                  ))}
                  <div className="ag-toolbar-r">
                    <select
                      className="ag-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortKey)}
                    >
                      <option value="recent">Mais Recentes</option>
                      <option value="price_asc">Preço Crescente</option>
                      <option value="price_desc">Preço Decrescente</option>
                      <option value="rating">Melhor Avaliação</option>
                    </select>
                    <button
                      className={`ag-icon-btn${!listView ? " on" : ""}`}
                      onClick={() => setListView(false)}
                      title="Grelha"
                    >
                      <Ic.Grid />
                    </button>
                    <button
                      className={`ag-icon-btn${listView ? " on" : ""}`}
                      onClick={() => setListView(true)}
                      title="Lista"
                    >
                      <Ic.List />
                    </button>
                  </div>
                </div>
                <div className={`ag-grid${listView ? " ag-grid-list" : ""}`}>
                  {filtered.length === 0 ? (
                    <div className="ag-empty">
                      <div className="ag-empty-ico">
                        <Ic.Sprout />
                      </div>
                      <div className="ag-empty-t">
                        Nenhum produto encontrado
                      </div>
                      <div className="ag-empty-s">
                        Ajuste os filtros ou o termo de pesquisa.
                      </div>
                    </div>
                  ) : (
                    filtered.map((p) => (
                      <ProductCard
                        key={p.id}
                        p={p}
                        onOpen={() => setModal(p)}
                        listView={listView}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* FORM PANEL */}
              <div>
                <div className="ag-panel">
                  <div className="ag-panel-title">Publicar Produto</div>
                  <div className="ag-panel-sub">
                    Alcance compradores em todo Moçambique
                  </div>
                  <div className="ag-panel-rule" />
                  <form onSubmit={handleSubmit}>
                    <div className="ag-field">
                      <label className="ag-label">Fotografia</label>
                      <div
                        className={`ag-upload${dragOver ? " drag" : ""}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(false);
                          const f = e.dataTransfer.files[0];
                          if (f) uploadImg(f);
                        }}
                        onClick={() =>
                          document.getElementById("ag-file")?.click()
                        }
                      >
                        {imgPrev ? (
                          <img src={imgPrev} alt="Preview" />
                        ) : (
                          <div className="ag-upload-inner">
                            <div className="ag-upload-ico">
                              <Ic.Upload />
                            </div>
                            <div className="ag-upload-hint">
                              Arraste ou <b>clique para carregar</b>
                              <br />
                              PNG · JPG · máx 5 MB
                            </div>
                          </div>
                        )}
                        <input
                          id="ag-file"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadImg(f);
                          }}
                        />
                      </div>
                    </div>

                    <div className="ag-field">
                      <label className="ag-label">Nome do Produto *</label>
                      <input
                        className="ag-input"
                        type="text"
                        required
                        placeholder="ex: Milho Seco, Tomate"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>

                    <div className="ag-row2">
                      <div className="ag-field">
                        <label className="ag-label">Preço (MZN) *</label>
                        <input
                          className="ag-input"
                          type="number"
                          min="0"
                          required
                          placeholder="1 500"
                          value={form.price}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, price: e.target.value }))
                          }
                        />
                      </div>
                      <div className="ag-field">
                        <label className="ag-label">Unidade</label>
                        <select
                          className="ag-input"
                          value={form.unit}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, unit: e.target.value }))
                          }
                        >
                          {UNITS.map((u) => (
                            <option key={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="ag-row2">
                      <div className="ag-field">
                        <label className="ag-label">Quantidade</label>
                        <input
                          className="ag-input"
                          type="number"
                          min="1"
                          placeholder="10"
                          value={form.quantity}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, quantity: e.target.value }))
                          }
                        />
                      </div>
                      <div className="ag-field">
                        <label className="ag-label">Colheita</label>
                        <input
                          className="ag-input"
                          type="month"
                          value={form.harvestDate}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              harvestDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="ag-field">
                      <label className="ag-label">Categoria *</label>
                      <select
                        className="ag-input"
                        required
                        value={form.category}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            category: e.target.value as Category,
                          }))
                        }
                      >
                        <option value="">Seleccione</option>
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="ag-row2">
                      <div className="ag-field">
                        <label className="ag-label">Localidade *</label>
                        <input
                          className="ag-input"
                          type="text"
                          required
                          placeholder="ex: Chókwè"
                          value={form.location}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, location: e.target.value }))
                          }
                        />
                      </div>
                      <div className="ag-field">
                        <label className="ag-label">Província *</label>
                        <select
                          className="ag-input"
                          required
                          value={form.province}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, province: e.target.value }))
                          }
                        >
                          <option value="">Seleccione</option>
                          {PROVINCES.map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="ag-field">
                      <label className="ag-label">
                        Contacto (Vodacom / Movitel / mCel) *
                      </label>
                      <input
                        className="ag-input"
                        type="text"
                        required
                        placeholder="84 123 4567"
                        value={form.contact}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, contact: e.target.value }))
                        }
                      />
                    </div>

                    <div className="ag-toggles">
                      {(
                        [
                          {
                            k: "organic",
                            l: "Produto Orgânico",
                            s: "Sem pesticidas químicos",
                          },
                          {
                            k: "transport",
                            l: "Transporte Disponível",
                            s: "Posso entregar ao comprador",
                          },
                          {
                            k: "barter",
                            l: "Aceito Troca Directa",
                            s: "Troco por outros produtos",
                          },
                        ] as const
                      ).map((t) => (
                        <div
                          key={t.k}
                          className="ag-toggle"
                          onClick={() => tog(t.k)}
                        >
                          <div>
                            <div className="ag-tgl-lbl">{t.l}</div>
                            <span className="ag-tgl-sub">{t.s}</span>
                          </div>
                          <div
                            className={`ag-switch${form[t.k] ? " on" : ""}`}
                          />
                        </div>
                      ))}
                    </div>

                    {form.barter && (
                      <div className="ag-field">
                        <label className="ag-label">
                          O que aceita em troca?
                        </label>
                        <input
                          className="ag-input"
                          type="text"
                          placeholder="ex: Ferramentas, sementes, feijão"
                          value={form.barterFor}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              barterFor: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}

                    <button type="submit" className="ag-btn-primary">
                      <Ic.Check />
                      Publicar Anúncio
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TROCAS */}
          {tab === "trocas" && (
            <div>
              <div className="ag-sec-hd">
                <h2 className="ag-sec-title">Troca Directa</h2>
                <span className="ag-sec-meta">
                  {barterList.length} disponíveis
                </span>
              </div>
              <p
                style={{
                  maxWidth: 600,
                  fontSize: ".855rem",
                  color: "var(--ink-3)",
                  lineHeight: 1.7,
                  marginBottom: "1.75rem",
                }}
              >
                Troque os seus produtos directamente com outros agricultores —
                sem dinheiro, sem bancos. Uma prática ancestral moçambicana
                integrada no mercado moderno.
              </p>
              {barterList.length === 0 ? (
                <div className="ag-empty">
                  <div className="ag-empty-ico">
                    <Ic.Swap />
                  </div>
                  <div className="ag-empty-t">
                    Sem produtos para troca de momento
                  </div>
                  <div className="ag-empty-s">
                    Publique um produto e active a opção "Aceito Troca Directa".
                  </div>
                </div>
              ) : (
                <div className="ag-barter-grid">
                  {barterList.map((p) => (
                    <div key={p.id} className="ag-barter">
                      <div className="ag-barter-hd">
                        <div
                          className="ag-barter-hd-ico"
                          style={{ color: CAT_COLOR[p.category] }}
                        >
                          <Ic.Sprout />
                        </div>
                        <div>
                          <div className="ag-barter-hd-name">{p.name}</div>
                          <div className="ag-barter-hd-loc">
                            {p.location}, {p.province}
                          </div>
                        </div>
                      </div>
                      <div className="ag-barter-body">
                        <div className="ag-barter-row">
                          <span className="ag-barter-lbl">Valor estimado</span>
                          <span className="ag-barter-val">
                            {p.price.toLocaleString("pt-MZ")} MZN/{p.unit}
                          </span>
                        </div>
                        <div className="ag-barter-row">
                          <span className="ag-barter-lbl">Quantidade</span>
                          <span className="ag-barter-val">
                            {p.quantity} {p.unit}
                          </span>
                        </div>
                        {p.barterFor && (
                          <div className="ag-barter-wants">
                            <div className="ag-barter-wants-ico">
                              <Ic.Swap />
                            </div>
                            <span>
                              Aceita: <strong>{p.barterFor}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        className="ag-barter-cta"
                        onClick={() => setModal(p)}
                      >
                        <Ic.Phone />
                        Propor Troca · {p.contact}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "alertas" && <AlertsTab />}
          {tab === "dicas" && <TipsTab />}
        </main>

        {/* ── FOOTER ── */}
        <footer className="ag-footer">
          <div className="ag-footer-in">
            <div>
              <div className="ag-footer-brand">
                AgroMarket <span>MZ</span>
              </div>
              <div className="ag-footer-sub">
                Ligando agricultores moçambicanos aos mercados ·{" "}
                {new Date().getFullYear()}
              </div>
            </div>
            {/* <div className="ag-footer-links">
              <a href="#" className="ag-footer-link">
                Sobre Nós
              </a>
              <a href="#" className="ag-footer-link">
                Contacto
              </a>
              <a href="#" className="ag-footer-link">
                Termos de Uso
              </a>
              <a href="#" className="ag-footer-link">
                Privacidade
              </a>
            </div> */}
          </div>
        </footer>
      </div>

      {modal && <ProductModal p={modal} onClose={() => setModal(null)} />}

      {toast && (
        <div className="ag-toast">
          <div className="ag-toast-check">
            <Ic.Check />
          </div>
          Produto publicado com sucesso
        </div>
      )}
    </>
  );
}
