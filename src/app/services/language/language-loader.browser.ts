import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { TransferState } from '@angular/platform-browser';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { makeLangStateKey } from '../../shared/helpers/make-lang-state-key.function';
import { Language } from '../../shared/enums/language.enum';

export class LanguageLoaderBrowser implements TranslateLoader {
  constructor(private httpHandler: HttpBackend, private transferState: TransferState) {}

  public getTranslation(lang: Language): Observable<any> {
    const translation = this.transferState.get(makeLangStateKey(lang), null);

    if (translation) {
      return of(translation);
    } else {
      return new TranslateHttpLoader(new HttpClient(this.httpHandler), './assets/translations/', '.json').getTranslation(lang);
    }
  }
}

export function languageLoaderBrowserFactory(httpHandler: HttpBackend, transferState: TransferState) {
  return new LanguageLoaderBrowser(httpHandler, transferState);
}
