import {
  DARK_MODE_CLASS_NAME,
  LIGHT_MODE_CLASS_NAME,
  PREFERS_COLOR_SCHEME_DARK,
  THEME_LOCAL_STORAGE_KEY,
} from '@/constants/theme.constant';
import { Theme } from '@/types/theme.type';
import { DOCUMENT } from '@angular/common';
import { Injectable, afterNextRender, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';

function preferedScheme(): 'dark' | 'light' {
  return window.matchMedia(PREFERS_COLOR_SCHEME_DARK).matches ? 'dark' : 'light';
}

@Injectable({ providedIn: 'root' })
export class ThemeManager {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>('light');
  readonly themeChanged$ = new Subject<void>();

  constructor() {
    afterNextRender(() => this.loadThemePreference());
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.updateLocalStorage(theme);
    this.updateDocumentClasses(theme);
  }

  getTheme(): 'dark' | 'light' {
    return this.theme();
  }

  private loadThemePreference() {
    const themeSaved = this.getThemeFromLocalStorage();
    const theme = themeSaved ?? preferedScheme();

    this.theme.set(theme);
    this.updateDocumentClasses(theme);
  }

  private getThemeFromLocalStorage(): Theme | null {
    return localStorage.getItem(THEME_LOCAL_STORAGE_KEY) as Theme | null;
  }

  private updateLocalStorage(theme: Theme) {
    localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);
  }

  private updateDocumentClasses(theme: 'dark' | 'light'): void {
    const documentoClasslist = this.document.documentElement.classList;

    if (theme === 'dark') {
      documentoClasslist.remove(LIGHT_MODE_CLASS_NAME);
      documentoClasslist.add(DARK_MODE_CLASS_NAME);
    } else {
      documentoClasslist.remove(DARK_MODE_CLASS_NAME);
      documentoClasslist.add(LIGHT_MODE_CLASS_NAME);
    }

    this.themeChanged$.next();
  }
}
