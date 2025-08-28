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
  selector: 'app-manifesto-vincular-modal',
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
    <h2 mat-dialog-title>Vincular Escalas ao Manifesto</h2>
    <mat-dialog-content>
      <div class="dialog-header">
        <p>
          <strong>Manifesto:</strong> {{ data.manifesto.numero }} -
          {{ data.manifesto.navio }}
        </p>
        <p><strong>Tipo:</strong> {{ getTipoText(data.manifesto.tipo) }}</p>
      </div>

      <div class="escalas-list">
        <h3>Escalas Disponíveis ({{ escalas.length }})</h3>
        <div class="checkbox-item" *ngFor="let escala of escalas">
          <mat-checkbox
            [(ngModel)]="escala.selecionado"
            [disabled]="!podeVincular(escala)"
            (click)="$event.stopPropagation()"
          >
            <span class="escala-info">
              <strong>{{ escala.navio }}</strong> -
              {{ escala.porto }}
              ({{ getStatusEscala(escala.status) }})
            </span>
            <span *ngIf="!podeVincular(escala)" class="disabled-reason">
              ⚠️
              {{ escala.status === 3 ? 'Escala cancelada' : 'Navio diferente' }}
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
      .escalas-list {
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

      .escala-info {
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
export class ManifestoVincularModalComponent {
  escalas: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ManifestoVincularModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.carregarEscalas();
  }

  async carregarEscalas() {
    try {
      const todasEscalas = await this.http
        .get<any[]>('http://localhost:5252/api/escalas')
        .toPromise();

      // Verifica se escalasVinculadas existe e é um array
      const vinculadas =
        this.data.manifesto.escalasVinculadas?.map((v: any) => v.escalaId) ||
        [];

      this.escalas =
        todasEscalas?.map((escala) => ({
          ...escala,
          selecionado: vinculadas.includes(escala.id),
        })) || [];
    } catch (error) {
      console.error('Erro ao carregar escalas', error);
    }
  }

  getTipoText(tipo: number): string {
    return tipo === 0 ? 'IMPORTAÇÃO' : 'EXPORTAÇÃO';
  }

  temSelecionados(): boolean {
    // Sempre retorna true se estamos no modo edição (já tinha vínculos)
    // Ou se há pelo menos um selecionado no modo adição
    const tinhaVinculos = this.data.manifesto.escalasVinculadas?.length > 0;
    const temSelecionados = this.escalas?.some((e) => e.selecionado);

    return tinhaVinculos || temSelecionados;
  }

  getTextoBotao(): string {
    const tinhaVinculos = this.data.manifesto.escalasVinculadas?.length > 0;
    const temSelecionados = this.escalas?.some((e) => e.selecionado);

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

  podeVincular(escala: any): boolean {
    return escala.status !== 3 && this.data.manifesto.navio === escala.navio;
  }

  async vincular() {
    try {
      const operacoes = [];

      for (const escala of this.escalas) {
        const estavaVinculada = this.data.manifesto.escalasVinculadas?.some(
          (v: any) => v.escalaId === escala.id
        );

        console.log(
          'Escala:',
          escala.id,
          'Selecionado:',
          escala.selecionado,
          'Estava vinculada:',
          estavaVinculada
        );

        if (escala.selecionado && !estavaVinculada) {
          // Adicionar vínculo - NOVO
          console.log(
            'VINCULAR: escala',
            escala.id,
            'ao manifesto',
            this.data.manifesto.id
          );
          operacoes.push(
            this.http
              .post(
                `http://localhost:5252/api/vinculos/${this.data.manifesto.id}/${escala.id}`,
                null
              )
              .toPromise()
          );
        } else if (!escala.selecionado && estavaVinculada) {
          // Remover vínculo - EXISTENTE
          console.log(
            'DESVINCULAR: escala',
            escala.id,
            'do manifesto',
            this.data.manifesto.id
          );
          operacoes.push(
            this.http
              .delete(
                `http://localhost:5252/api/vinculos/${this.data.manifesto.id}/${escala.id}`
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
