import { DrawDialog } from '@/dialogs/draw/draw.dialog';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';

@Component({
  selector: 'app-preview',
  imports: [DialogModule],
  host: {
    class: 'flex-1 place-content-center',
  },
  templateUrl: './preview.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewPage {
  private readonly dialog = inject(Dialog);
  private readonly document = inject(DOCUMENT);

  protected readonly assinaturaURL = signal<string | null>(null);

  assinar() {
    const ref = this.dialog.open<string>(DrawDialog);

    ref.closed.subscribe(response => {
      if (response) this.assinaturaURL.set(response);
    });
  }

  baixar(url: string) {
    const a = this.document.createElement('a');
    a.href = url;
    a.download = 'assinatura.png';
    a.click();
    a.remove();
  }

  remover() {
    this.assinaturaURL.set(null);
  }
}
