/**
 * Script para gerar dados mock do sistema Pedido Rápido
 * Execute: node scripts/generateMock.js
 */

const fs = require('fs');
const path = require('path');

const mockDir = path.join(__dirname, '..', 'src', 'mock');

// Produtos por quiosque
const generateProducts = () => {
  const products = [];
  const kioskProducts = {
    kiosk_001: [
      { name: 'Caipirinha Tradicional', cat: 'cat_001', price: 18.90, prep: 5 },
      { name: 'Caipirinha de Morango', cat: 'cat_001', price: 22.90, prep: 5 },
      { name: 'Cerveja Long Neck', cat: 'cat_001', price: 12.90, prep: 1 },
      { name: 'Chopp 300ml', cat: 'cat_001', price: 9.90, prep: 2 },
      { name: 'Água de Coco', cat: 'cat_001', price: 8.90, prep: 2 },
      { name: 'Suco de Laranja', cat: 'cat_001', price: 12.90, prep: 5 },
      { name: 'Refrigerante Lata', cat: 'cat_001', price: 6.90, prep: 1 },
      { name: 'Água Mineral', cat: 'cat_001', price: 4.90, prep: 1 },
      { name: 'Porção de Batata Frita', cat: 'cat_002', price: 32.90, prep: 15 },
      { name: 'Isca de Peixe', cat: 'cat_002', price: 48.90, prep: 18 },
      { name: 'Camarão Empanado', cat: 'cat_002', price: 68.90, prep: 20 },
      { name: 'Lula à Dorê', cat: 'cat_002', price: 58.90, prep: 18 },
      { name: 'Casquinha de Siri', cat: 'cat_002', price: 28.90, prep: 12 },
      { name: 'Bolinho de Bacalhau', cat: 'cat_002', price: 42.90, prep: 15 },
      { name: 'Moqueca de Peixe', cat: 'cat_003', price: 89.90, prep: 35, recipe: 'rec_001' },
      { name: 'Moqueca de Camarão', cat: 'cat_003', price: 109.90, prep: 35, recipe: 'rec_002' },
      { name: 'Bobó de Camarão', cat: 'cat_003', price: 98.90, prep: 30, recipe: 'rec_003' },
      { name: 'Peixe Grelhado', cat: 'cat_003', price: 68.90, prep: 25 },
      { name: 'Pudim de Leite', cat: 'cat_004', price: 14.90, prep: 3 },
      { name: 'Mousse de Maracujá', cat: 'cat_004', price: 16.90, prep: 3 },
    ],
    kiosk_002: [
      { name: 'Mojito', cat: 'cat_005', price: 26.90, prep: 6 },
      { name: 'Piña Colada', cat: 'cat_005', price: 28.90, prep: 8 },
      { name: 'Margarita', cat: 'cat_005', price: 28.90, prep: 6 },
      { name: 'Cerveja Artesanal', cat: 'cat_005', price: 18.90, prep: 1 },
      { name: 'Batida de Coco', cat: 'cat_005', price: 18.90, prep: 5 },
      { name: 'Caipiroska', cat: 'cat_005', price: 22.90, prep: 5 },
      { name: 'Porção de Camarão', cat: 'cat_006', price: 78.90, prep: 20 },
      { name: 'Porção de Lula', cat: 'cat_006', price: 62.90, prep: 18 },
      { name: 'Tábua de Frios', cat: 'cat_006', price: 78.90, prep: 10 },
      { name: 'Caldeirada de Frutos do Mar', cat: 'cat_007', price: 98.90, prep: 35, recipe: 'rec_004' },
      { name: 'Lagosta Grelhada', cat: 'cat_007', price: 189.90, prep: 35 },
      { name: 'Arroz de Polvo', cat: 'cat_007', price: 98.90, prep: 35 },
      { name: 'Camarão na Moranga', cat: 'cat_007', price: 128.90, prep: 40, recipe: 'rec_005' },
      { name: 'Petit Gateau', cat: 'cat_008', price: 24.90, prep: 12 },
      { name: 'Sorvete 2 Bolas', cat: 'cat_008', price: 18.90, prep: 3 },
    ],
    kiosk_003: [
      { name: 'Suco de Acerola', cat: 'cat_009', price: 10.90, prep: 5 },
      { name: 'Suco de Cajá', cat: 'cat_009', price: 10.90, prep: 5 },
      { name: 'Suco de Graviola', cat: 'cat_009', price: 12.90, prep: 5 },
      { name: 'Vitamina de Banana', cat: 'cat_009', price: 14.90, prep: 5 },
      { name: 'Acarajé Tradicional', cat: 'cat_010', price: 18.90, prep: 12 },
      { name: 'Acarajé Especial', cat: 'cat_010', price: 24.90, prep: 15 },
      { name: 'Abará', cat: 'cat_010', price: 16.90, prep: 10 },
      { name: 'Moqueca Baiana', cat: 'cat_011', price: 95.90, prep: 35, recipe: 'rec_006' },
      { name: 'Vatapá', cat: 'cat_011', price: 68.90, prep: 25 },
      { name: 'Caruru', cat: 'cat_011', price: 58.90, prep: 25 },
      { name: 'Açaí 300ml', cat: 'cat_012', price: 22.90, prep: 5 },
      { name: 'Açaí 500ml', cat: 'cat_012', price: 32.90, prep: 5 },
      { name: 'Açaí na Tigela', cat: 'cat_012', price: 28.90, prep: 8 },
    ],
    kiosk_004: [
      { name: 'Café com Leite', cat: 'cat_013', price: 6.90, prep: 3 },
      { name: 'Cappuccino', cat: 'cat_013', price: 9.90, prep: 5 },
      { name: 'Pão na Chapa', cat: 'cat_013', price: 8.90, prep: 5 },
      { name: 'Cuscuz com Ovo', cat: 'cat_013', price: 16.90, prep: 12, recipe: 'rec_007' },
      { name: 'Omelete Completa', cat: 'cat_013', price: 22.90, prep: 12 },
      { name: 'Tapioca Simples', cat: 'cat_014', price: 12.90, prep: 8 },
      { name: 'Tapioca de Carne Seca', cat: 'cat_014', price: 22.90, prep: 12 },
      { name: 'Tapioca de Queijo Coalho', cat: 'cat_014', price: 18.90, prep: 10 },
      { name: 'Tapioca de Frango', cat: 'cat_014', price: 20.90, prep: 12 },
      { name: 'Sanduíche Natural', cat: 'cat_015', price: 18.90, prep: 10 },
      { name: 'X-Tudo', cat: 'cat_015', price: 28.90, prep: 15 },
      { name: 'Misto Quente', cat: 'cat_015', price: 12.90, prep: 8 },
    ],
    kiosk_005: [
      { name: 'Caipirinha de Limão', cat: 'cat_016', price: 18.90, prep: 5 },
      { name: 'Drink do Mar', cat: 'cat_016', price: 32.90, prep: 8 },
      { name: 'Sex on the Beach', cat: 'cat_016', price: 32.90, prep: 6 },
      { name: 'Blue Lagoon', cat: 'cat_016', price: 28.90, prep: 6 },
      { name: 'Caranguejo Inteiro', cat: 'cat_017', price: 45.90, prep: 25 },
      { name: 'Caranguejo ao Alho', cat: 'cat_017', price: 68.90, prep: 28, recipe: 'rec_008' },
      { name: 'Patinha de Caranguejo', cat: 'cat_017', price: 58.90, prep: 20 },
      { name: 'Casquinha de Caranguejo', cat: 'cat_017', price: 32.90, prep: 15 },
      { name: 'Caldo de Sururu', cat: 'cat_018', price: 28.90, prep: 20 },
      { name: 'Caldo de Camarão', cat: 'cat_018', price: 32.90, prep: 20 },
      { name: 'Caldo Verde', cat: 'cat_018', price: 22.90, prep: 18 },
    ],
    kiosk_006: [
      { name: 'Vinho Tinto Taça', cat: 'cat_019', price: 22.90, prep: 2 },
      { name: 'Vinho Branco Taça', cat: 'cat_019', price: 22.90, prep: 2 },
      { name: 'Espumante Taça', cat: 'cat_019', price: 28.90, prep: 2 },
      { name: 'Sangria', cat: 'cat_019', price: 32.90, prep: 5 },
      { name: 'Carpaccio de Salmão', cat: 'cat_020', price: 48.90, prep: 15 },
      { name: 'Bruschetta Italiana', cat: 'cat_020', price: 28.90, prep: 12 },
      { name: 'Ceviche', cat: 'cat_020', price: 52.90, prep: 18 },
      { name: 'Risoto de Camarão', cat: 'cat_021', price: 88.90, prep: 30, recipe: 'rec_009' },
      { name: 'Filé ao Molho de Alcaparras', cat: 'cat_021', price: 98.90, prep: 35 },
      { name: 'Salmão Grelhado', cat: 'cat_021', price: 85.90, prep: 28 },
    ],
    kiosk_007: [
      { name: 'Água de Coco Natural', cat: 'cat_022', price: 7.90, prep: 2 },
      { name: 'Água de Coco com Polpa', cat: 'cat_022', price: 10.90, prep: 3 },
      { name: 'Coco Verde', cat: 'cat_022', price: 6.90, prep: 1 },
      { name: 'Moqueca Capixaba', cat: 'cat_023', price: 92.90, prep: 35, recipe: 'rec_010' },
      { name: 'Moqueca de Robalo', cat: 'cat_023', price: 98.90, prep: 35 },
      { name: 'Torta Capixaba', cat: 'cat_023', price: 42.90, prep: 20 },
      { name: 'Torta de Limão', cat: 'cat_024', price: 16.90, prep: 3 },
      { name: 'Torta de Chocolate', cat: 'cat_024', price: 18.90, prep: 3 },
      { name: 'Torta de Maracujá', cat: 'cat_024', price: 16.90, prep: 3 },
    ],
    kiosk_008: [
      { name: 'Champanhe Taça', cat: 'cat_025', price: 45.90, prep: 2 },
      { name: 'Espumante Nacional', cat: 'cat_025', price: 32.90, prep: 2 },
      { name: 'Aperol Spritz', cat: 'cat_025', price: 38.90, prep: 5 },
      { name: 'Mini Croquetes', cat: 'cat_026', price: 38.90, prep: 15 },
      { name: 'Ostras Frescas (6un)', cat: 'cat_026', price: 68.90, prep: 8 },
      { name: 'Tartare de Atum', cat: 'cat_026', price: 58.90, prep: 15 },
      { name: 'Lagosta Termidor', cat: 'cat_027', price: 249.90, prep: 45 },
      { name: 'Robalo ao Molho de Maracujá', cat: 'cat_027', price: 128.90, prep: 35 },
      { name: 'Camarão Flambado', cat: 'cat_027', price: 148.90, prep: 30, recipe: 'rec_011' },
    ],
    kiosk_009: [
      { name: 'Tapioca de Coco', cat: 'cat_028', price: 14.90, prep: 8 },
      { name: 'Tapioca de Banana com Canela', cat: 'cat_028', price: 16.90, prep: 10 },
      { name: 'Tapioca de Carne de Sol', cat: 'cat_028', price: 24.90, prep: 12, recipe: 'rec_012' },
      { name: 'Suco de Caju', cat: 'cat_029', price: 9.90, prep: 5 },
      { name: 'Suco de Mangaba', cat: 'cat_029', price: 10.90, prep: 5 },
      { name: 'Suco de Umbu', cat: 'cat_029', price: 10.90, prep: 5 },
      { name: 'Cuscuz Nordestino', cat: 'cat_030', price: 18.90, prep: 15, recipe: 'rec_013' },
      { name: 'Cuscuz com Carne de Sol', cat: 'cat_030', price: 28.90, prep: 18 },
      { name: 'Cuscuz com Charque', cat: 'cat_030', price: 26.90, prep: 18 },
    ],
    kiosk_010: [
      { name: 'Água de Coco Gelada', cat: 'cat_031', price: 7.90, prep: 2 },
      { name: 'Suco de Mangaba', cat: 'cat_031', price: 10.90, prep: 5 },
      { name: 'Licor de Jenipapo', cat: 'cat_031', price: 12.90, prep: 2 },
      { name: 'Caranguejo Completo', cat: 'cat_033', price: 52.90, prep: 28 },
      { name: 'Aratu', cat: 'cat_033', price: 38.90, prep: 20 },
      { name: 'Moqueca Sergipana', cat: 'cat_032', price: 78.90, prep: 30, recipe: 'rec_014' },
      { name: 'Baião de Dois', cat: 'cat_032', price: 38.90, prep: 25 },
      { name: 'Fritada de Camarão', cat: 'cat_032', price: 62.90, prep: 22 },
    ]
  };

  let prodId = 1;
  Object.entries(kioskProducts).forEach(([kioskId, prods]) => {
    prods.forEach(p => {
      products.push({
        id: `prod_${String(prodId).padStart(3, '0')}`,
        kioskId,
        categoryId: p.cat,
        name: p.name,
        description: `Delicioso(a) ${p.name.toLowerCase()} preparado(a) com ingredientes frescos e selecionados.`,
        price: p.price,
        promotionalPrice: Math.random() > 0.8 ? Math.round(p.price * 0.85 * 100) / 100 : null,
        images: [`https://images.unsplash.com/photo-${1500000000000 + prodId}?w=400`],
        isAvailable: Math.random() > 0.1,
        isHighlighted: Math.random() > 0.85,
        preparationTime: p.prep,
        recipeId: p.recipe || null,
        allergens: [],
        tags: [],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-11-01T10:00:00Z'
      });
      prodId++;
    });
  });

  return products;
};

// Ingredientes/Estoque por quiosque
const generateStock = () => {
  const stock = [];
  const ingredients = [
    { name: 'Camarão Rosa', unit: 'kg', cost: 75.00, min: 5 },
    { name: 'Peixe Fresco', unit: 'kg', cost: 45.00, min: 8 },
    { name: 'Lula', unit: 'kg', cost: 55.00, min: 4 },
    { name: 'Lagosta', unit: 'kg', cost: 180.00, min: 2 },
    { name: 'Polvo', unit: 'kg', cost: 95.00, min: 3 },
    { name: 'Caranguejo', unit: 'unit', cost: 15.00, min: 20 },
    { name: 'Leite de Coco', unit: 'l', cost: 12.00, min: 10 },
    { name: 'Azeite de Dendê', unit: 'l', cost: 28.00, min: 5 },
    { name: 'Arroz', unit: 'kg', cost: 6.00, min: 20 },
    { name: 'Batata', unit: 'kg', cost: 8.00, min: 15 },
    { name: 'Cebola', unit: 'kg', cost: 5.00, min: 10 },
    { name: 'Alho', unit: 'kg', cost: 35.00, min: 3 },
    { name: 'Tomate', unit: 'kg', cost: 8.00, min: 10 },
    { name: 'Limão', unit: 'kg', cost: 6.00, min: 8 },
    { name: 'Cachaça', unit: 'l', cost: 18.00, min: 10 },
    { name: 'Vodka', unit: 'l', cost: 45.00, min: 5 },
    { name: 'Açúcar', unit: 'kg', cost: 4.50, min: 15 },
    { name: 'Gelo', unit: 'kg', cost: 3.00, min: 50 },
    { name: 'Cerveja Long Neck', unit: 'unit', cost: 4.50, min: 100 },
    { name: 'Refrigerante', unit: 'unit', cost: 2.50, min: 80 }
  ];

  let stockId = 1;
  for (let k = 1; k <= 10; k++) {
    const kioskId = `kiosk_${String(k).padStart(3, '0')}`;
    ingredients.forEach(ing => {
      const currentStock = Math.floor(Math.random() * ing.min * 3) + 1;
      stock.push({
        id: `ing_${String(stockId).padStart(3, '0')}`,
        kioskId,
        name: ing.name,
        description: `${ing.name} de alta qualidade`,
        unit: ing.unit,
        currentStock,
        minimumStock: ing.min,
        maximumStock: ing.min * 5,
        costPerUnit: ing.cost,
        supplier: ['Fornecedor A', 'Fornecedor B', 'Distribuidora C'][Math.floor(Math.random() * 3)],
        isActive: true,
        lastRestockDate: '2024-11-01T10:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-11-01T10:00:00Z'
      });
      stockId++;
    });
  }

  return stock;
};

// Receitas
const generateRecipes = () => {
  return [
    {
      id: 'rec_001',
      kioskId: 'kiosk_001',
      productId: 'prod_015',
      name: 'Receita Moqueca de Peixe',
      description: 'Moqueca tradicional com peixe fresco',
      yield: 1,
      yieldUnit: 'porção',
      preparationTime: 35,
      instructions: ['Tempere o peixe', 'Refogue os vegetais', 'Adicione o leite de coco', 'Cozinhe por 25 min'],
      ingredients: [
        { ingredientId: 'ing_002', ingredientName: 'Peixe Fresco', quantity: 0.4, unit: 'kg', costPerPortion: 18.00 },
        { ingredientId: 'ing_007', ingredientName: 'Leite de Coco', quantity: 0.2, unit: 'l', costPerPortion: 2.40 },
        { ingredientId: 'ing_008', ingredientName: 'Azeite de Dendê', quantity: 0.05, unit: 'l', costPerPortion: 1.40 },
        { ingredientId: 'ing_011', ingredientName: 'Cebola', quantity: 0.1, unit: 'kg', costPerPortion: 0.50 },
        { ingredientId: 'ing_013', ingredientName: 'Tomate', quantity: 0.15, unit: 'kg', costPerPortion: 1.20 }
      ],
      totalCost: 23.50,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-11-01T10:00:00Z'
    },
    {
      id: 'rec_002',
      kioskId: 'kiosk_001',
      productId: 'prod_016',
      name: 'Receita Moqueca de Camarão',
      description: 'Moqueca com camarões rosa selecionados',
      yield: 1,
      yieldUnit: 'porção',
      preparationTime: 35,
      instructions: ['Limpe os camarões', 'Refogue os temperos', 'Adicione leite de coco e dendê', 'Finalize com coentro'],
      ingredients: [
        { ingredientId: 'ing_001', ingredientName: 'Camarão Rosa', quantity: 0.35, unit: 'kg', costPerPortion: 26.25 },
        { ingredientId: 'ing_007', ingredientName: 'Leite de Coco', quantity: 0.25, unit: 'l', costPerPortion: 3.00 },
        { ingredientId: 'ing_008', ingredientName: 'Azeite de Dendê', quantity: 0.05, unit: 'l', costPerPortion: 1.40 }
      ],
      totalCost: 30.65,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-11-01T10:00:00Z'
    },
    {
      id: 'rec_003',
      kioskId: 'kiosk_001',
      productId: 'prod_017',
      name: 'Receita Bobó de Camarão',
      description: 'Bobó cremoso com camarões',
      yield: 1,
      yieldUnit: 'porção',
      preparationTime: 30,
      instructions: ['Cozinhe a mandioca', 'Bata até formar creme', 'Refogue camarões', 'Misture tudo'],
      ingredients: [
        { ingredientId: 'ing_001', ingredientName: 'Camarão Rosa', quantity: 0.3, unit: 'kg', costPerPortion: 22.50 },
        { ingredientId: 'ing_007', ingredientName: 'Leite de Coco', quantity: 0.2, unit: 'l', costPerPortion: 2.40 }
      ],
      totalCost: 24.90,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-11-01T10:00:00Z'
    }
  ];
};

// Pedidos
const generateOrders = () => {
  const orders = [];
  const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
  const paymentMethods = ['cash', 'credit_card', 'debit_card', 'pix'];
  const customerNames = [
    'João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Lucas Ferreira',
    'Juliana Lima', 'Rafael Souza', 'Beatriz Almeida', 'Gabriel Rocha', 'Larissa Mendes'
  ];

  for (let i = 1; i <= 350; i++) {
    const kioskNum = Math.floor(Math.random() * 10) + 1;
    const kioskId = `kiosk_${String(kioskNum).padStart(3, '0')}`;
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const qty = Math.floor(Math.random() * 3) + 1;
      const price = Math.round((Math.random() * 80 + 15) * 100) / 100;
      items.push({
        id: `item_${i}_${j}`,
        productId: `prod_${String(Math.floor(Math.random() * 150) + 1).padStart(3, '0')}`,
        productName: ['Caipirinha', 'Moqueca', 'Porção de Camarão', 'Cerveja', 'Açaí'][Math.floor(Math.random() * 5)],
        quantity: qty,
        unitPrice: price,
        totalPrice: Math.round(qty * price * 100) / 100,
        addons: [],
        notes: null
      });
      subtotal += qty * price;
    }

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const day = Math.floor(Math.random() * 30) + 1;
    const month = Math.floor(Math.random() * 11) + 1;

    orders.push({
      id: `ord_${String(i).padStart(3, '0')}`,
      kioskId,
      customerId: Math.random() > 0.3 ? `usr_${String(Math.floor(Math.random() * 89) + 12).padStart(3, '0')}` : null,
      customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
      customerPhone: `(${10 + Math.floor(Math.random() * 80)}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      tableNumber: Math.random() > 0.5 ? String(Math.floor(Math.random() * 20) + 1) : null,
      status,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.random() > 0.8 ? Math.round(subtotal * 0.1 * 100) / 100 : 0,
      tax: 0,
      total: Math.round(subtotal * 100) / 100,
      paymentMethod: status !== 'pending' ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : null,
      paymentStatus: status === 'delivered' ? 'paid' : status === 'cancelled' ? 'refunded' : 'pending',
      notes: null,
      estimatedTime: Math.floor(Math.random() * 30) + 10,
      createdAt: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(Math.floor(Math.random() * 14) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`,
      updatedAt: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(Math.floor(Math.random() * 14) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z`,
      completedAt: status === 'delivered' ? `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(Math.floor(Math.random() * 14) + 9).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00Z` : null
    });
  }

  return orders;
};

// Gerar e salvar arquivos
console.log('Gerando dados mock...');

const products = generateProducts();
const stock = generateStock();
const recipes = generateRecipes();
const orders = generateOrders();

fs.writeFileSync(path.join(mockDir, 'products.json'), JSON.stringify(products, null, 2));
console.log(`✓ ${products.length} produtos gerados`);

fs.writeFileSync(path.join(mockDir, 'stock.json'), JSON.stringify(stock, null, 2));
console.log(`✓ ${stock.length} itens de estoque gerados`);

fs.writeFileSync(path.join(mockDir, 'recipes.json'), JSON.stringify(recipes, null, 2));
console.log(`✓ ${recipes.length} receitas geradas`);

fs.writeFileSync(path.join(mockDir, 'orders.json'), JSON.stringify(orders, null, 2));
console.log(`✓ ${orders.length} pedidos gerados`);

console.log('\n✅ Dados mock gerados com sucesso!');

