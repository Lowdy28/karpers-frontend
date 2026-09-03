import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  editingId = signal<number | null>(null);
  editingProduct = signal<Product | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    categoryId: [0, Validators.required],
    available: [true],
  });

  ngOnInit(): void {
    this.loadProducts();
    this.categoryService.getAll().subscribe((data) => this.categories.set(data));
  }

  loadProducts(): void {
    this.productService.getAll().subscribe((data) => this.products.set(data));
  }

  edit(product: Product): void {
    this.editingId.set(product.id);
    this.editingProduct.set(product);
    this.form.patchValue({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      available: product.available,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editingProduct.set(null);
    this.form.reset({ name: '', price: 0, categoryId: 0, available: true });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const payload: Partial<Product> = {
      name: formValue.name!,
      price: formValue.price!,
      categoryId: formValue.categoryId!,
      available: formValue.available!,
      variants: this.editingProduct()?.variants ?? [],
    };

    const id = this.editingId();

    const request = id
      ? this.productService.update(id, payload)
      : this.productService.create(payload);

    request.subscribe(() => {
      this.cancelEdit();
      this.loadProducts();
    });
  }

  remove(product: Product): void {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;

    this.productService.delete(product.id).subscribe(() => this.loadProducts());
  }
}
