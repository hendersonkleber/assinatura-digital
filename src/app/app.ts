import { FooterComponent } from '@/components/footer/footer.component';
import { HeaderComponent } from '@/components/header/header.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  host: {
    class: 'block min-h-svh flex flex-col bg-background text-foreground',
    role: 'application',
  },
  template: `
    <app-header />

    <main class="flex-1 flex flex-col relative overflow-auto">
      <router-outlet />
    </main>

    <app-footer />
  `,
})
export class App {}
