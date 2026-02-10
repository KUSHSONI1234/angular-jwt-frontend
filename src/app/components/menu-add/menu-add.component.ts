import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-add.component.html',
  styleUrl: './menu-add.component.css',
})
export class MenuAddComponent implements OnInit, AfterViewInit {
  menuForm!: FormGroup;
  parentMenus: any[] = [];

  mode: 'add' | 'edit' | 'view' = 'add';
  menuId!: number;

  @ViewChild('MenuNameInput') MenuNameInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    //   Detect mode FIRST
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.menuId = +id;
      this.mode = this.router.url.includes('edit') ? 'edit' : 'view';
    }

    //  Create form
    this.menuForm = this.fb.group({
      menuType: ['', Validators.required],
      menuName: ['', Validators.required],
      icon: [''],
      link: [''],
      parentId: [''],
      sortingOrder: [''],
    });

    //  Load parent menus
    this.loadMasterMenus();

    //   If edit/view → load menu data
    if (id) {
      this.loadMenuById();
    }

    //   Disable in view mode
    if (this.mode === 'view') {
      this.menuForm.disable();
    }

    //   Dynamic validators
    this.menuForm.get('menuType')?.valueChanges.subscribe((type) => {
      this.setValidators(type);
      setTimeout(() => {
        this.MenuNameInput?.nativeElement.focus();
      }, 100);
    });
  }

  ngAfterViewInit(): void {
    if (this.mode !== 'view') {
      this.MenuNameInput?.nativeElement.focus();
    }
  }

  //  Load menu by ID
  loadMenuById() {
    this.menuService.getMenuById(this.menuId).subscribe({
      next: (res: any) => {
        this.menuForm.patchValue({
          menuType: res.data.menuType,
          menuName: res.data.menuName,
          icon: res.data.icon,
          link: res.data.link,
          parentId: res.data.parentId,
          sortingOrder: res.data.sorting,
        });
      },
      error: () => alert('Failed to load menu'),
    });
  }

  loadMasterMenus() {
    this.menuService.getMasterMenus().subscribe({
      next: (res: any) => {
        this.parentMenus = res.data || [];
      },
      error: () => {
        this.parentMenus = [];
      },
    });
  }

  setValidators(type: any) {
    const icon = this.menuForm.get('icon');
    const link = this.menuForm.get('link');

    icon?.clearValidators();
    link?.clearValidators();

    //  Your dropdown sends numbers (1,2)
    if (type == 1) {
      icon?.setValidators([Validators.required]);
    }

    if (type == 2) {
      link?.setValidators([Validators.required]);
    }

    icon?.updateValueAndValidity();
    link?.updateValueAndValidity();
  }

  get f() {
    return this.menuForm.controls;
  }

  onSubmit() {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    const formValue = this.menuForm.getRawValue();

    const payload = {
      menuType: formValue.menuType,
      menuName: formValue.menuName,
      icon: formValue.icon,
      link: formValue.link,
      parentId: formValue.parentId ? Number(formValue.parentId) : null,
      sorting: formValue.sortingOrder,
    };

    //  ADD
    if (this.mode === 'add') {
      this.menuService.addMenu(payload).subscribe({
        next: (res) => {
          alert(res.message);
          this.router.navigate(['/dashboard/menu']);
        },
        error: () => alert('Error saving menu'),
      });
    }

    //  EDIT
    else if (this.mode === 'edit') {
      this.menuService.updateMenu(this.menuId, payload).subscribe({
        next: () => {
          alert('Menu updated');
          this.router.navigate(['/dashboard/menu']);
        },
        error: () => alert('Error updating menu'),
      });
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/menu']);
  }
}
