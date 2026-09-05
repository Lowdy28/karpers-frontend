import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategories implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  editingId = signal<number | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe((data) => this.categories.set(data));
  }

  edit(category: Category): void {
    this.editingId.set(category.id);
    this.form.patchValue({ name: category.name });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ name: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();
    const payload: Partial<Category> = { name: formValue.name! };
    const id = this.editingId();

    const request = id
      ? this.categoryService.update(id, payload)
      : this.categoryService.create(payload);

    request.subscribe(() => {
      this.cancelEdit();
      this.loadCategories();
    });
  }

  remove(category: Category): void {
    if (!confirm(`¿Eliminar "${category.name}"? Solo funciona si no tiene productos asignados.`)) return;

    this.categoryService.delete(category.id).subscribe({
      next: () => this.loadCategories(),
      error: () => alert('No se pudo eliminar: la categoría tiene productos asignados.'),
    });
  }
}
