/**
 * Funções de validação
 */

/**
 * Valida email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida senha (mínimo 8 caracteres, pelo menos uma letra e um número)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
};

/**
 * Valida senha forte (mínimo 8 caracteres, maiúscula, minúscula, número e especial)
 */
export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};

/**
 * Retorna força da senha
 */
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  if (score <= 2) {
    return { score, label: 'Fraca', color: '#FF4444' };
  }
  if (score <= 4) {
    return { score, label: 'Média', color: '#FFBB33' };
  }
  return { score, label: 'Forte', color: '#00C851' };
};

/**
 * Valida telefone brasileiro
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Valida CEP
 */
export const isValidCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
};

/**
 * Valida CPF
 */
export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[10])) return false;
  
  return true;
};

/**
 * Valida CNPJ
 */
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * weights1[i];
  }
  
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit1 !== parseInt(cleaned[12])) return false;
  
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned[i]) * weights2[i];
  }
  
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit2 !== parseInt(cleaned[13])) return false;
  
  return true;
};

/**
 * Valida URL
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida slug
 */
export const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

/**
 * Valida se string não está vazia
 */
export const isNotEmpty = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

/**
 * Valida comprimento mínimo
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Valida comprimento máximo
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Valida número dentro de um range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Valida número positivo
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

/**
 * Valida número não negativo
 */
export const isNonNegative = (value: number): boolean => {
  return value >= 0;
};

/**
 * Valida data futura
 */
export const isFutureDate = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
};

/**
 * Valida data passada
 */
export const isPastDate = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
};

/**
 * Valida formato de hora (HH:MM)
 */
export const isValidTime = (time: string): boolean => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

/**
 * Valida extensão de arquivo
 */
export const hasValidExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
};

/**
 * Interface para resultado de validação
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valida formulário de login
 */
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!isNotEmpty(email)) {
    errors.push('Email é obrigatório');
  } else if (!isValidEmail(email)) {
    errors.push('Email inválido');
  }
  
  if (!isNotEmpty(password)) {
    errors.push('Senha é obrigatória');
  } else if (!hasMinLength(password, 6)) {
    errors.push('Senha deve ter no mínimo 6 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida formulário de cadastro
 */
export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult => {
  const errors: string[] = [];
  
  if (!isNotEmpty(name)) {
    errors.push('Nome é obrigatório');
  } else if (!hasMinLength(name, 2)) {
    errors.push('Nome deve ter no mínimo 2 caracteres');
  }
  
  if (!isNotEmpty(email)) {
    errors.push('Email é obrigatório');
  } else if (!isValidEmail(email)) {
    errors.push('Email inválido');
  }
  
  if (!isNotEmpty(password)) {
    errors.push('Senha é obrigatória');
  } else if (!isValidPassword(password)) {
    errors.push('Senha deve ter no mínimo 8 caracteres, incluindo letra e número');
  }
  
  if (password !== confirmPassword) {
    errors.push('Senhas não conferem');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida formulário de produto
 */
export const validateProductForm = (
  name: string,
  price: number,
  categoryId: string
): ValidationResult => {
  const errors: string[] = [];
  
  if (!isNotEmpty(name)) {
    errors.push('Nome é obrigatório');
  } else if (!hasMinLength(name, 2)) {
    errors.push('Nome deve ter no mínimo 2 caracteres');
  }
  
  if (!isPositive(price)) {
    errors.push('Preço deve ser maior que zero');
  }
  
  if (!isNotEmpty(categoryId)) {
    errors.push('Categoria é obrigatória');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

