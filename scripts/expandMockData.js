/**
 * Script para expandir dados mock do Pedido Rápido
 * Adiciona mais quiosques, funcionários e avaliações
 */

const fs = require('fs');
const path = require('path');

// Utilitários
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(randomFloat(min, max + 1));
const randomItem = (arr) => arr[randomInt(0, arr.length - 1)];
const randomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
};

// Dados base
const brazilianCities = [
  { city: 'Santos', state: 'SP', region: 'sudeste' },
  { city: 'Guarujá', state: 'SP', region: 'sudeste' },
  { city: 'Ubatuba', state: 'SP', region: 'sudeste' },
  { city: 'Rio de Janeiro', state: 'RJ', region: 'sudeste' },
  { city: 'Niterói', state: 'RJ', region: 'sudeste' },
  { city: 'Angra dos Reis', state: 'RJ', region: 'sudeste' },
  { city: 'Búzios', state: 'RJ', region: 'sudeste' },
  { city: 'Cabo Frio', state: 'RJ', region: 'sudeste' },
  { city: 'Salvador', state: 'BA', region: 'nordeste' },
  { city: 'Porto Seguro', state: 'BA', region: 'nordeste' },
  { city: 'Ilhéus', state: 'BA', region: 'nordeste' },
  { city: 'Florianópolis', state: 'SC', region: 'sul' },
  { city: 'Balneário Camboriú', state: 'SC', region: 'sul' },
  { city: 'Recife', state: 'PE', region: 'nordeste' },
  { city: 'Fortaleza', state: 'CE', region: 'nordeste' },
  { city: 'Natal', state: 'RN', region: 'nordeste' },
  { city: 'Maceió', state: 'AL', region: 'nordeste' },
  { city: 'Vitória', state: 'ES', region: 'sudeste' },
  { city: 'João Pessoa', state: 'PB', region: 'nordeste' },
  { city: 'Aracaju', state: 'SE', region: 'nordeste' },
];

const kioskNames = [
  'Quiosque Sol Nascente', 'Bar do Coqueiro', 'Recanto da Praia',
  'Onda Azul', 'Areia Dourada', 'Brisa do Mar', 'Pôr do Sol',
  'Maré Alta', 'Refúgio Tropical', 'Baía Serena', 'Costa Verde',
  'Horizonte Azul', 'Pérola do Mar', 'Vento Sul', 'Estrela do Mar'
];

const firstNames = [
  'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Lucas', 'Fernanda',
  'Gabriel', 'Amanda', 'Rafael', 'Camila', 'Bruno', 'Larissa', 'Diego',
  'Patricia', 'Thiago', 'Beatriz', 'Gustavo', 'Mariana', 'Felipe', 'Carolina'
];

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida',
  'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Araújo'
];

const comments = [
  'Excelente atendimento! Voltarei sempre.',
  'Comida deliciosa, ambiente agradável.',
  'Bom custo-benefício.',
  'Atendimento rápido e eficiente.',
  'Local muito bonito, recomendo!',
  'Garçom muito atencioso.',
  'Pratos bem servidos.',
  'Drinks maravilhosos!',
  'Preço justo pela qualidade.',
  'Vista incrível para o mar.',
  'Música ambiente agradável.',
  'Funcionários simpáticos.',
  'Melhor quiosque da praia!',
  'Comida fresca e saborosa.',
  'Experiência memorável.',
];

// Carregar dados existentes
const mockPath = path.join(__dirname, '..', 'src', 'mock');
const existingKiosks = JSON.parse(fs.readFileSync(path.join(mockPath, 'kiosks.json'), 'utf-8'));
const existingEmployees = JSON.parse(fs.readFileSync(path.join(mockPath, 'employees.json'), 'utf-8'));
const existingRatings = JSON.parse(fs.readFileSync(path.join(mockPath, 'ratings.json'), 'utf-8'));
const existingProducts = JSON.parse(fs.readFileSync(path.join(mockPath, 'products.json'), 'utf-8'));

// Gerar novos quiosques
const generateNewKiosks = (startId, count) => {
  const newKiosks = [];
  const usedCities = existingKiosks.map(k => k.address?.city).filter(Boolean);
  
  for (let i = 0; i < count; i++) {
    const id = `kiosk_${String(startId + i).padStart(3, '0')}`;
    const location = randomItem(brazilianCities);
    const name = `${randomItem(kioskNames)} ${location.city}`;
    const slug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const plans = ['plan_free', 'plan_basic', 'plan_professional', 'plan_premium'];
    const planWeights = [0.1, 0.3, 0.4, 0.2]; // Free 10%, Basic 30%, Pro 40%, Premium 20%
    const rand = Math.random();
    let planIndex = 0;
    let cumulative = 0;
    for (let j = 0; j < planWeights.length; j++) {
      cumulative += planWeights[j];
      if (rand <= cumulative) {
        planIndex = j;
        break;
      }
    }
    
    newKiosks.push({
      id,
      name,
      slug,
      description: `O melhor quiosque de ${location.city}. Especializado em frutos do mar frescos e drinks tropicais.`,
      logo: `https://images.unsplash.com/photo-${1500000000000 + randomInt(0, 100000000)}?w=200`,
      coverImage: `https://images.unsplash.com/photo-${1500000000000 + randomInt(0, 100000000)}?w=1200`,
      address: {
        street: `Av. Beira Mar`,
        number: String(randomInt(100, 5000)),
        complement: `Quiosque ${randomInt(1, 50)}`,
        neighborhood: 'Centro',
        city: location.city,
        state: location.state,
        zipCode: `${randomInt(10000, 99999)}-${randomInt(100, 999)}`,
        country: 'Brasil',
        coordinates: {
          latitude: randomFloat(-25, -3),
          longitude: randomFloat(-50, -34)
        }
      },
      contact: {
        phone: `(${randomInt(11, 99)}) ${randomInt(3000, 3999)}-${randomInt(1000, 9999)}`,
        whatsapp: `(${randomInt(11, 99)}) 9${randomInt(7000, 9999)}-${randomInt(1000, 9999)}`,
        email: `contato@${slug.slice(0, 15)}.com.br`,
        instagram: `@${slug.slice(0, 15)}`
      },
      operatingHours: [
        { dayOfWeek: 'sunday', isOpen: true, openTime: '08:00', closeTime: '22:00' },
        { dayOfWeek: 'monday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
        { dayOfWeek: 'tuesday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
        { dayOfWeek: 'wednesday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
        { dayOfWeek: 'thursday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
        { dayOfWeek: 'friday', isOpen: true, openTime: '10:00', closeTime: '23:00' },
        { dayOfWeek: 'saturday', isOpen: true, openTime: '08:00', closeTime: '23:00' }
      ],
      isActive: true,
      isPublic: true,
      licenseExpiry: randomDate(new Date('2025-06-01'), new Date('2026-12-31')),
      createdAt: randomDate(new Date('2023-01-01'), new Date('2024-06-01')),
      updatedAt: randomDate(new Date('2024-06-01'), new Date('2025-01-01')),
      ownerId: `usr_${String(randomInt(2, 50)).padStart(3, '0')}`,
      planId: plans[planIndex],
      settings: {
        allowOnlineOrders: true,
        allowTableOrders: true,
        requirePaymentUpfront: false,
        estimatedPrepTime: randomInt(10, 30),
        maxOrdersPerHour: randomInt(20, 100)
      }
    });
  }
  
  return newKiosks;
};

// Gerar novos funcionários
const generateNewEmployees = (kiosks, existingCount) => {
  const newEmployees = [];
  const roles = ['waiter', 'bartender', 'cook', 'cashier', 'manager'];
  
  let empId = existingCount + 1;
  
  // 2-5 funcionários por quiosque novo
  for (const kiosk of kiosks) {
    const numEmployees = randomInt(2, 5);
    for (let i = 0; i < numEmployees; i++) {
      const firstName = randomItem(firstNames);
      const lastName = randomItem(lastNames);
      
      newEmployees.push({
        id: `emp_${String(empId++).padStart(3, '0')}`,
        kioskId: kiosk.id,
        kioskName: kiosk.name,
        name: `${firstName} ${lastName}`,
        role: randomItem(roles),
        phone: `(${randomInt(11, 99)}) 9${randomInt(7000, 9999)}-${randomInt(1000, 9999)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        document: `${randomInt(100, 999)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(10, 99)}`,
        hireDate: randomDate(new Date('2022-01-01'), new Date('2024-12-01')),
        salary: randomInt(1500, 4000),
        workSchedule: '08:00 - 16:00',
        isActive: Math.random() > 0.1,
        rating: randomFloat(3.5, 5),
        totalRatings: randomInt(5, 100),
        photo: `https://i.pravatar.cc/150?u=emp_${empId}`,
        createdAt: randomDate(new Date('2022-01-01'), new Date('2024-06-01')),
        updatedAt: randomDate(new Date('2024-06-01'), new Date('2025-01-01'))
      });
    }
  }
  
  return newEmployees;
};

// Gerar avaliações
const generateRatings = (allKiosks, allEmployees, allProducts, existingCount) => {
  const newRatings = [];
  const types = ['kiosk', 'product', 'employee', 'service'];
  
  let ratingId = existingCount + 1;
  
  // Gerar 150+ avaliações
  for (let i = 0; i < 150; i++) {
    const type = randomItem(types);
    const kiosk = randomItem(allKiosks);
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    
    let entityId, entityName;
    
    switch (type) {
      case 'kiosk':
        entityId = kiosk.id;
        entityName = kiosk.name;
        break;
      case 'product':
        const product = randomItem(allProducts);
        entityId = product.id;
        entityName = product.name;
        break;
      case 'employee':
        const kioskEmployees = allEmployees.filter(e => e.kioskId === kiosk.id);
        if (kioskEmployees.length === 0) continue;
        const emp = randomItem(kioskEmployees);
        entityId = emp.id;
        entityName = emp.name;
        break;
      case 'service':
        entityId = kiosk.id;
        entityName = `Atendimento - ${kiosk.name}`;
        break;
    }
    
    newRatings.push({
      id: `rating_${String(ratingId++).padStart(3, '0')}`,
      kioskId: kiosk.id,
      kioskName: kiosk.name,
      orderId: `order_${String(randomInt(1, 500)).padStart(4, '0')}`,
      customerId: `usr_customer_${randomInt(1, 100)}`,
      customerName: `${firstName} ${lastName}`,
      type,
      entityType: type,
      entityId,
      targetId: entityId,
      targetName: entityName,
      rating: randomInt(3, 5),
      score: randomInt(3, 5),
      comment: Math.random() > 0.3 ? randomItem(comments) : null,
      createdAt: randomDate(new Date('2024-01-01'), new Date('2025-01-13')),
      updatedAt: randomDate(new Date('2024-06-01'), new Date('2025-01-13'))
    });
  }
  
  return newRatings;
};

// Gerar licenças para novos quiosques
const generateLicenses = (newKiosks, existingCount) => {
  const newLicenses = [];
  
  let licId = existingCount + 1;
  
  for (const kiosk of newKiosks) {
    const planId = kiosk.planId || 'plan_basic';
    const plan = planId.replace('plan_', '');
    
    const billingCycles = ['monthly', 'semiannual', 'annual'];
    const billingCycle = randomItem(billingCycles);
    
    const prices = {
      plan_free: { monthly: 0, semiannual: 0, annual: 0 },
      plan_basic: { monthly: 99.90, semiannual: 539.40, annual: 958.80 },
      plan_professional: { monthly: 199.90, semiannual: 1079.40, annual: 1918.80 },
      plan_premium: { monthly: 299.90, semiannual: 1619.40, annual: 2878.80 }
    };
    
    const features = {
      plan_free: { stockManagement: false, employeeManagement: false, publicRanking: false },
      plan_basic: { stockManagement: true, employeeManagement: false, publicRanking: false },
      plan_professional: { stockManagement: true, employeeManagement: true, publicRanking: true },
      plan_premium: { stockManagement: true, employeeManagement: true, publicRanking: true, prioritySupport: true }
    };
    
    const limits = {
      plan_free: { products: 10, ordersPerMonth: 50, employees: 0 },
      plan_basic: { products: 50, ordersPerMonth: 500, employees: 0 },
      plan_professional: { products: -1, ordersPerMonth: -1, employees: 5 },
      plan_premium: { products: -1, ordersPerMonth: -1, employees: -1 }
    };
    
    newLicenses.push({
      id: `lic_${String(licId++).padStart(3, '0')}`,
      kioskId: kiosk.id,
      kioskName: kiosk.name,
      planId,
      plan,
      status: Math.random() > 0.1 ? 'active' : 'expiring_soon',
      startDate: randomDate(new Date('2024-01-01'), new Date('2024-12-01')),
      expiryDate: randomDate(new Date('2025-06-01'), new Date('2026-12-31')),
      billingCycle,
      price: prices[planId]?.[billingCycle] || 99.90,
      totalPaid: prices[planId]?.[billingCycle] || 99.90,
      autoRenew: Math.random() > 0.3,
      features: features[planId] || features.plan_basic,
      limits: limits[planId] || limits.plan_basic,
      paymentHistory: [
        {
          id: `pay_${randomInt(100, 999)}`,
          date: randomDate(new Date('2024-01-01'), new Date('2025-01-01')),
          amount: prices[planId]?.[billingCycle] || 99.90,
          status: 'paid',
          method: randomItem(['credit_card', 'pix', 'boleto']),
          invoice: `INV-2024-${randomInt(100, 999)}`
        }
      ],
      createdAt: randomDate(new Date('2024-01-01'), new Date('2024-06-01')),
      updatedAt: randomDate(new Date('2024-06-01'), new Date('2025-01-01'))
    });
  }
  
  return newLicenses;
};

// Executar
console.log('🚀 Expandindo dados mock do Pedido Rápido...\n');

// 1. Gerar novos quiosques (de 10 para 20)
const newKiosks = generateNewKiosks(11, 10);
const allKiosks = [...existingKiosks, ...newKiosks];
console.log(`✅ Quiosques: ${existingKiosks.length} → ${allKiosks.length}`);

// 2. Gerar novos funcionários
const newEmployees = generateNewEmployees(newKiosks, existingEmployees.length);
const allEmployees = [...existingEmployees, ...newEmployees];
console.log(`✅ Funcionários: ${existingEmployees.length} → ${allEmployees.length}`);

// 3. Gerar avaliações
const newRatings = generateRatings(allKiosks, allEmployees, existingProducts, existingRatings.length);
const allRatings = [...existingRatings, ...newRatings];
console.log(`✅ Avaliações: ${existingRatings.length} → ${allRatings.length}`);

// 4. Gerar licenças
const existingLicenses = JSON.parse(fs.readFileSync(path.join(mockPath, 'licenses.json'), 'utf-8'));
const newLicenses = generateLicenses(newKiosks, existingLicenses.length);
const allLicenses = [...existingLicenses, ...newLicenses];
console.log(`✅ Licenças: ${existingLicenses.length} → ${allLicenses.length}`);

// Salvar arquivos
fs.writeFileSync(path.join(mockPath, 'kiosks.json'), JSON.stringify(allKiosks, null, 2));
fs.writeFileSync(path.join(mockPath, 'employees.json'), JSON.stringify(allEmployees, null, 2));
fs.writeFileSync(path.join(mockPath, 'ratings.json'), JSON.stringify(allRatings, null, 2));
fs.writeFileSync(path.join(mockPath, 'licenses.json'), JSON.stringify(allLicenses, null, 2));

console.log('\n🎉 Dados expandidos com sucesso!');
console.log(`
📊 Resumo:
   - Quiosques: ${allKiosks.length}
   - Funcionários: ${allEmployees.length}
   - Avaliações: ${allRatings.length}
   - Licenças: ${allLicenses.length}
`);

