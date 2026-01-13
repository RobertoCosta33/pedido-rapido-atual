"use client";

/**
 * Página de gerenciamento de produtos
 */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Button, Input, DataTable, Modal } from "@/components";
import { productService } from "@/services";
import { useNotification } from "@/contexts";
import { formatCurrency } from "@/utils/formatters";
import { Product, Category, TableColumn } from "@/types";

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  width: 300px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const StatusBadge = styled.span<{ $available: boolean }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ theme, $available }) =>
    $available
      ? `${theme.colors.success.main}20`
      : `${theme.colors.error.main}20`};
  color: ${({ theme, $available }) =>
    $available ? theme.colors.success.main : theme.colors.error.main};
`;

const HighlightBadge = styled.span`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.primary.main}20;
  color: ${({ theme }) => theme.colors.primary.main};
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: cover;
`;

const ProductName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CategorySelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.paper};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: block;
`;

export const ProductsPage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts("1"),
        productService.getCategories("1"),
      ]);
      setProducts(productsData.data);
      setCategories(categoriesData);
    } catch (error) {
      showError("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`Deseja realmente excluir "${product.name}"?`)) {
      try {
        await productService.deleteProduct(product.id);
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        showSuccess("Produto removido com sucesso");
      } catch (error) {
        showError("Erro ao remover produto");
      }
    }
  };

  const handleSave = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    showSuccess("Produto salvo com sucesso");
    loadData();
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "-";
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns: TableColumn<Product>[] = [
    {
      key: "name",
      label: "Produto",
      sortable: true,
      render: (_, item) => (
        <ProductName>
          {item.imageUrl && (
            <ProductImage src={item.imageUrl} alt={item.name} />
          )}
          <div>
            <span>{item.name}</span>
            {item.isHighlighted && (
              <HighlightBadge style={{ marginLeft: 8 }}>
                Destaque
              </HighlightBadge>
            )}
          </div>
        </ProductName>
      ),
    },
    {
      key: "categoryId",
      label: "Categoria",
      render: (value) => getCategoryName(value as string),
    },
    {
      key: "price",
      label: "Preço",
      sortable: true,
      render: (value, item) => <div>{formatCurrency(value as number)}</div>,
    },
    {
      key: "isAvailable",
      label: "Status",
      render: (value) => (
        <StatusBadge $available={value as boolean}>
          {value ? "Disponível" : "Indisponível"}
        </StatusBadge>
      ),
    },
    {
      key: "preparationTime",
      label: "Preparo",
      render: (value) => `${value} min`,
    },
    {
      key: "actions",
      label: "Ações",
      sortable: false,
      render: (_, item) => (
        <Actions>
          <IconButton
            size="small"
            title="Editar"
            onClick={() => handleEdit(item)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            title="Excluir"
            onClick={() => handleDelete(item)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Actions>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <Title>Produtos</Title>

        <Toolbar>
          <SearchWrapper>
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<SearchIcon />}
            />
          </SearchWrapper>

          <Button
            leftIcon={<AddIcon />}
            onClick={() => {
              setSelectedProduct(null);
              setModalOpen(true);
            }}
          >
            Novo Produto
          </Button>
        </Toolbar>
      </Header>

      <DataTable
        columns={columns}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage="Nenhum produto encontrado"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedProduct ? "Editar Produto" : "Novo Produto"}
        size="large"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </>
        }
      >
        <ModalContent>
          <FormGrid>
            <Input
              label="Nome do Produto"
              placeholder="Ex: X-Burger Clássico"
              defaultValue={selectedProduct?.name}
              required
            />
            <div>
              <Label>Categoria</Label>
              <CategorySelect defaultValue={selectedProduct?.category}>
                <option value="">Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </CategorySelect>
            </div>
          </FormGrid>

          <Input
            label="Descrição"
            placeholder="Descrição do produto"
            defaultValue={selectedProduct?.description}
          />

          <FormGrid>
            <Input
              type="number"
              label="Preço (R$)"
              placeholder="0,00"
              defaultValue={selectedProduct?.price}
              required
            />
            <Input
              type="number"
              label="Preço Promocional (R$)"
              placeholder="0,00"
            />
          </FormGrid>

          <FormGrid>
            <Input
              type="number"
              label="Tempo de Preparo (min)"
              placeholder="15"
            />
            <Input
              label="URL da Imagem"
              placeholder="https://..."
              defaultValue={selectedProduct?.imageUrl}
            />
          </FormGrid>
        </ModalContent>
      </Modal>
    </Container>
  );
};
