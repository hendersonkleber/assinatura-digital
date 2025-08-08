import { ThemeManager } from '@/services/theme-manager.service';
import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';

@Component({
  selector: 'app-draw',
  imports: [],
  templateUrl: './draw.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawDialog {
  private readonly dialogRef = inject(DialogRef);
  private readonly themeManager = inject(ThemeManager);

  private readonly elemento = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private contexto!: CanvasRenderingContext2D;
  private desenhando = false;

  constructor() {
    this.dialogRef.overlayRef.updateSize({ minWidth: '80vw', maxWidth: '99vw' });

    afterNextRender(() => {
      const elemento = this.elemento().nativeElement;
      const contexto = elemento.getContext('2d')!;

      const tamanho = elemento.getBoundingClientRect();

      contexto.canvas.width = tamanho.width;
      contexto.canvas.height = tamanho.height;
      contexto.lineWidth = 2;
      contexto.lineCap = 'round';
      contexto.imageSmoothingEnabled = true;

      if (this.themeManager.getTheme() === 'dark') contexto.strokeStyle = 'white';
      else contexto.strokeStyle = 'black';

      contexto.fillStyle = 'transparent';
      contexto.fillRect(0, 0, elemento.width, elemento.height);

      this.contexto = contexto;
    });
  }

  fechar() {
    this.dialogRef.close();
  }

  limpar() {
    const elemento = this.elemento().nativeElement;
    const tamanho = elemento.getBoundingClientRect();
    this.contexto.clearRect(0, 0, tamanho.width, tamanho.height);
  }

  salvar() {
    const url = this.elemento().nativeElement.toDataURL('image/png');
    this.dialogRef.close(url);
  }

  obterPosicao(evento: MouseEvent | TouchEvent): { x: number; y: number } {
    const dimensao = this.elemento().nativeElement.getBoundingClientRect();

    if (evento instanceof MouseEvent) {
      return { x: evento.clientX - dimensao.x, y: evento.clientY - dimensao.y };
    } else {
      return { x: evento.touches[0].clientX - dimensao.x, y: evento.touches[0].clientY - dimensao.y };
    }
  }

  comecar(evento: MouseEvent | TouchEvent) {
    const posicao = this.obterPosicao(evento);
    this.contexto.moveTo(posicao.x, posicao.y);
    this.contexto.beginPath();
    this.desenhando = true;
  }

  desenhar(evento: MouseEvent | TouchEvent) {
    if (!this.desenhando) return;

    const posicao = this.obterPosicao(evento);
    this.contexto.lineTo(posicao.x, posicao.y);
    this.contexto.stroke();
  }

  parar() {
    this.desenhando = false;
    this.contexto.closePath();
  }
}
