import { ThemeManager } from '@/services/theme-manager.service';
import { Theme } from '@/types/theme.type';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly themeManager = inject(ThemeManager);

  public readonly theme = computed(() => {
    return this.themeManager.theme();
  });

  changeTheme(theme: Theme) {
    this.themeManager.setTheme(theme === 'dark' ? 'light' : 'dark');
  }
}
