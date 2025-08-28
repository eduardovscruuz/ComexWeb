import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EscalaVincularModalComponent } from './components/escala-vincular-modal/escala-vincular-modal.component';
import { ManifestoVincularModalComponent } from './components/manifesto-vincular-modal/manifesto-vincular-modal.component';

// Angular Material
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DetailsDialogComponent } from './components/modal-detalhes/modal-detalhes.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    HttpClientModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class AppComponent implements OnInit {
  // Inicializando sempre como array vazio
  escalas: any[] = [];
  manifestos: any[] = [];

  displayedColumnsEscalas: string[] = [
    'navio',
    'porto',
    'status',
    'eta',
    'etb',
    'etd',
    'manifestos',
    'acoes',
  ];

  displayedColumnsManifestos: string[] = [
    'numero',
    'tipo',
    'navio',
    'portoOrigem',
    'portoDestino',
    'escalas',
    'acoes',
  ];

  filtroEscalas: string = '';
  filtroManifestos: string = '';

  // Controle de tab
  tabIndex: number = 0;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  async ngOnInit() {
    try {
      this.escalas =
        (await this.http
          .get<any[]>('http://localhost:5252/api/escalas')
          .toPromise()) || [];
      this.manifestos =
        (await this.http
          .get<any[]>('http://localhost:5252/api/manifestos')
          .toPromise()) || [];

      // Garantir arrays sempre válidos
      this.escalas.forEach(
        (e) => (e.manifestosVinculados = e.manifestosVinculados || [])
      );
      this.manifestos.forEach(
        (m) => (m.escalasVinculadas = m.escalasVinculadas || [])
      );
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    }
    this.tabIndex = 0;
    history.replaceState(null, '', '/escalas');
  }

  // Atualiza tabIndex e URL (opcional)
  tabChanged(index: number) {
    this.tabIndex = index;
    const tabName = index === 0 ? 'escalas' : 'manifestos';
    history.replaceState(null, '', `/${tabName}`);
  }

  // Filtros
  get escalasFiltradas() {
    if (!this.filtroEscalas) return this.escalas;
    const filtro = this.filtroEscalas.toLowerCase();
    return this.escalas.filter(
      (e) =>
        e.navio.toLowerCase().includes(filtro) ||
        e.porto.toLowerCase().includes(filtro) ||
        this.getStatusEscala(e.status).toLowerCase().includes(filtro)
    );
  }

  get manifestosFiltrados() {
    if (!this.filtroManifestos) return this.manifestos;
    const filtro = this.filtroManifestos.toLowerCase();
    return this.manifestos.filter(
      (m) =>
        m.numero.toLowerCase().includes(filtro) ||
        m.navio.toLowerCase().includes(filtro) ||
        m.portoOrigem.toLowerCase().includes(filtro) ||
        m.portoDestino.toLowerCase().includes(filtro) ||
        this.getTipoText(m.tipo).toLowerCase().includes(filtro)
    );
  }

  // Status e tipo
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

  getTipoText(tipo: number): string {
    return tipo === 0 ? 'IMPORTAÇÃO' : 'EXPORTAÇÃO';
  }

  formatarData(data: string | null): string {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  gerenciarVinculacaoEscala(escala: any): void {
    const dialogRef = this.dialog.open(EscalaVincularModalComponent, {
      data: { escala },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        // Recarregar dados
        this.carregarDados();
      }
    });
  }

  gerenciarVinculacaoManifesto(manifesto: any): void {
    const dialogRef = this.dialog.open(ManifestoVincularModalComponent, {
      data: { manifesto },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        // Recarregar dados
        this.carregarDados();
      }
    });
  }

  async carregarDados() {
    try {
      this.escalas =
        (await this.http
          .get<any[]>('http://localhost:5252/api/escalas')
          .toPromise()) || [];
      this.manifestos =
        (await this.http
          .get<any[]>('http://localhost:5252/api/manifestos')
          .toPromise()) || [];

      this.escalas.forEach(
        (e) => (e.manifestosVinculados = e.manifestosVinculados || [])
      );
      this.manifestos.forEach(
        (m) => (m.escalasVinculadas = m.escalasVinculadas || [])
      );
    } catch (error) {
      console.error('Erro ao carregar dados', error);
    }
  }

  // Abrir modal de detalhes
  openDetails(tipo: 'escala' | 'manifesto', id: number) {
    const url = `http://localhost:5252/api/${tipo}s/${id}`;
    this.http.get(url).subscribe(
      (item) => {
        const dialogRef = this.dialog.open(DetailsDialogComponent, {
          data: { tipo, item },
          width: '400px',
        });

        // Atualiza URL com id
        history.replaceState(null, '', `/${tipo}s/${id}`);

        // Quando fechar, volta para a lista (sem id)
        dialogRef.afterClosed().subscribe(() => {
          history.replaceState(null, '', `/${tipo}s`);
        });
      },
      (error) => console.error('Erro ao buscar detalhes:', error)
    );
  }
}
