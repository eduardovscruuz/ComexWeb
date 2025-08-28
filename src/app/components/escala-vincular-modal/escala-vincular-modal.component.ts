import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-escala-vincular-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
  ],
  template: `
    <h2 mat-dialog-title>Vincular Manifestos à Escala</h2>
    <mat-dialog-content>
      <div class="dialog-header">
        <p>
          <strong>Escala:</strong> {{ data.escala.navio }} -
          {{ data.escala.porto }}
        </p>
        <p>
          <strong>Status:</strong> {{ getStatusEscala(data.escala.status) }}
        </p>
      </div>

      <div class="manifestos-list">
        <h3>Manifestos Disponíveis ({{ manifestos.length }})</h3>
        <div class="checkbox-item" *ngFor="let manifesto of manifestos">
          <mat-checkbox
            [(ngModel)]="manifesto.selecionado"
            [disabled]="!podeVincular(manifesto)"
            (click)="$event.stopPropagation()"
          >
            <span class="manifesto-info">
              <strong>{{ manifesto.numero }}</strong> -
              {{ manifesto.navio }}
              ({{ getTipoText(manifesto.tipo) }})
            </span>
            <span *ngIf="!podeVincular(manifesto)" class="disabled-reason">
              ⚠️ Navio diferente
            </span>
          </mat-checkbox>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button
        mat-button
        (click)="vincular()"
        color="primary"
        [disabled]="!temSelecionados()"
      >
        {{ getTextoBotao() }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .manifestos-list {
        max-height: 400px;
        overflow: auto;
        margin: 16px 0;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 12px;
      }

      .checkbox-item {
        margin: 8px 0;
        padding: 8px;
        border-radius: 4px;
      }

      .checkbox-item:hover {
        background-color: #f5f5f5;
      }

      .manifesto-info {
        display: block;
        margin-left: 8px;
      }

      .disabled-reason {
        font-size: 12px;
        color: #f44336;
        margin-left: 8px;
      }

      .dialog-header {
        background-color: #f8f9fa;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 16px;
      }

      .dialog-header p {
        margin: 4px 0;
      }

      mat-checkbox {
        display: flex;
        align-items: center;
      }
    `,
  ],
})
export class EscalaVincularModalComponent {
  manifestos: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EscalaVincularModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.carregarManifestos();
  }

  async carregarManifestos() {
    try {
      const todosManifestos = await this.http
        .get<any[]>('http://localhost:5252/api/manifestos')
        .toPromise();

      console.log('Todos manifestos:', todosManifestos);
      console.log('Escala atual:', this.data.escala);
      console.log(
        'Manifestos vinculados à escala:',
        this.data.escala.manifestosVinculados
      );

      const vinculados =
        this.data.escala.manifestosVinculados?.map((v: any) => v.manifestoId) ||
        [];

      console.log('IDs dos manifestos vinculados:', vinculados);

      this.manifestos =
        todosManifestos?.map((manifesto) => ({
          ...manifesto,
          selecionado: vinculados.includes(manifesto.id),
        })) || [];

      console.log('Manifestos processados:', this.manifestos);
    } catch (error) {
      console.error('Erro ao carregar manifestos', error);
    }
  }

  getTipoText(tipo: number): string {
    return tipo === 0 ? 'IMPORTAÇÃO' : 'EXPORTAÇÃO';
  }

  temSelecionados(): boolean {
    // Sempre retorna true se estamos no modo edição (já tinha vínculos)
    // Ou se há pelo menos um selecionado no modo adição
    const tinhaVinculos = this.data.escala.manifestosVinculados?.length > 0;
    const temSelecionados = this.manifestos?.some((m) => m.selecionado);

    return tinhaVinculos || temSelecionados;
  }
  getTextoBotao(): string {
    const tinhaVinculos = this.data.escala.manifestosVinculados?.length > 0;
    const temSelecionados = this.manifestos?.some((m) => m.selecionado);

    if (tinhaVinculos && !temSelecionados) {
      return 'Remover Todos os Vínculos';
    } else if (tinhaVinculos || temSelecionados) {
      return 'Salvar Alterações';
    } else {
      return 'Nenhum selecionado';
    }
  }

  getStatusEscala(status: number): string {
    switch (status) {
      case 0:
        return 'PREVISTA';
      case 1:
        return 'ATRACADA';
      case 2:
        return 'SAIU';
      case 3:
        return 'CANCELADA';
      default:
        return 'Desconhecido';
    }
  }

  podeVincular(manifesto: any): boolean {
    return this.data.escala.navio === manifesto.navio;
  }

  async vincular() {
    try {
      const operacoes = [];

      for (const manifesto of this.manifestos) {
        const estavaVinculado = this.data.escala.manifestosVinculados?.some(
          (v: any) => v.manifestoId === manifesto.id
        );

        console.log(
          'Manifesto:',
          manifesto.id,
          'Selecionado:',
          manifesto.selecionado,
          'Estava vinculado:',
          estavaVinculado
        );

        if (manifesto.selecionado && !estavaVinculado) {
          // Adicionar vínculo - NOVO
          console.log(
            'VINCULAR: manifesto',
            manifesto.id,
            'à escala',
            this.data.escala.id
          );
          operacoes.push(
            this.http
              .post(
                `http://localhost:5252/api/vinculos/${manifesto.id}/${this.data.escala.id}`,
                null
              )
              .toPromise()
          );
        } else if (!manifesto.selecionado && estavaVinculado) {
          // Remover vínculo - EXISTENTE
          console.log(
            'DESVINCULAR: manifesto',
            manifesto.id,
            'da escala',
            this.data.escala.id
          );
          operacoes.push(
            this.http
              .delete(
                `http://localhost:5252/api/vinculos/${manifesto.id}/${this.data.escala.id}`
              )
              .toPromise()
          );
        }
      }

      console.log('Operações a serem executadas:', operacoes.length);

      // Executa todas as operações em paralelo
      if (operacoes.length > 0) {
        await Promise.all(operacoes);
      }

      this.dialogRef.close('success');
    } catch (error) {
      console.error('Erro ao vincular', error);
      alert(
        'Erro ao processar os vínculos. Verifique o console para mais detalhes.'
      );
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
