import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // <-- IMPORTAR

@Component({
  selector: 'app-details-dialog',
  template: `
    <h2 mat-dialog-title>Detalhes de {{ data.tipo }}</h2>
    <mat-dialog-content>
      <pre>{{ data.item | json }}</pre>
      <!-- agora funciona -->
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Fechar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule, // <-- ADICIONAR
  ],
})
export class DetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close();
  }
}
