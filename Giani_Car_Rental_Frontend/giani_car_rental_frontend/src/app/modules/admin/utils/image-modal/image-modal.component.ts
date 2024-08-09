import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.scss'
})
export class ImageModalComponent {
  @Input() imageUrl: string | null = null;
  @ViewChild('imageModal') imageModal!: ElementRef;

  openModal() {
    this.imageModal.nativeElement.classList.add('show');
    this.imageModal.nativeElement.style.display = 'block';
  }

  closeModal() {
    this.imageModal.nativeElement.classList.remove('show');
    this.imageModal.nativeElement.style.display = 'none';
  }
}

