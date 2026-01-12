/**
 * Funções utilitárias de formatação
 */

/**
 * Formata valor monetário em Real brasileiro
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata número com separadores de milhar
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Formata data no padrão brasileiro
 */
export const formatDate = (date: Date | string, includeTime: boolean = false): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('pt-BR', options).format(d);
};

/**
 * Formata data relativa (ex: "há 2 horas")
 */
export const formatRelativeDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSeconds < 60) {
    return 'agora mesmo';
  }
  if (diffMinutes < 60) {
    return `há ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
  }
  if (diffHours < 24) {
    return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  }
  if (diffDays < 30) {
    return `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  }
  if (diffMonths < 12) {
    return `há ${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
  }
  return `há ${diffYears} ${diffYears === 1 ? 'ano' : 'anos'}`;
};

/**
 * Formata telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Formata CEP
 */
export const formatCEP = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Formata CPF
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata CNPJ
 */
export const formatCNPJ = (cnpj: string): string => {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Formata tempo de preparo em minutos
 */
export const formatPrepTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Formata tamanho de arquivo
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Gera slug a partir de texto
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Trunca texto com ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Capitaliza primeira letra
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitaliza todas as palavras
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Formata nome do dia da semana
 */
export const formatDayOfWeek = (day: string): string => {
  const days: Record<string, string> = {
    sunday: 'Domingo',
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
  };
  return days[day] || day;
};

/**
 * Formata status de pedido
 */
export const formatOrderStatus = (status: string): string => {
  const statuses: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };
  return statuses[status] || status;
};

/**
 * Formata unidade de medida
 */
export const formatUnit = (unit: string, quantity?: number): string => {
  const units: Record<string, { singular: string; plural: string }> = {
    kg: { singular: 'kg', plural: 'kg' },
    g: { singular: 'g', plural: 'g' },
    mg: { singular: 'mg', plural: 'mg' },
    l: { singular: 'L', plural: 'L' },
    ml: { singular: 'ml', plural: 'ml' },
    unit: { singular: 'unidade', plural: 'unidades' },
    dozen: { singular: 'dúzia', plural: 'dúzias' },
    pack: { singular: 'pacote', plural: 'pacotes' },
  };
  
  const unitInfo = units[unit];
  if (!unitInfo) return unit;
  
  if (quantity !== undefined && quantity !== 1) {
    return unitInfo.plural;
  }
  
  return unitInfo.singular;
};

