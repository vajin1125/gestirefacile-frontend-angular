export class Config {

  static readonly prop = Object.freeze(
    {
      //prod
      /*apiEndpoint: 'https://rent.altervista.org/api/',
      urlImages: '/images'*/
      //test
      apiEndpoint: 'http://localhost/api/',
      urlImages: 'http://localhost/images',
      urlDocs: 'http://localhost/docs',
      domain : 'localhost',

      // apiEndpoint: 'https://www.gestirefacile.it/api/',
      // urlImages: 'https://www.gestirefacile.it/images',
      // urlDocs: 'https://www.gestirefacile.it/docs',
      // domain : 'gestirefacile.it',
      
      cookieMessage : 'Utilizzando il nostro sito, riconosci di aver letto e compreso la nostra ',
      cookiePolicyLink : 'Gestione dei Cookie',
      cookiePolicyHref : 'https://www.gestirefacile.it/policy.html',
      privacyPolicyLink: 'Politica sulla riservatezza',
      privacyPolicyHref: 'https://www.gestirefacile.it/privacy.html',
      tosLink: 'Termini del servizio',
      tosHref: 'https://www.gestirefacile.it/tos.html',
      messageLink: `
      <span id="cookieconsent:desc" class="cc-message">{{message}} 
        <a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{cookiePolicyHref}}" target="_blank">{{cookiePolicyLink}}</a>, 
        <a aria-label="learn more about our privacy policy" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}" target="_blank">{{privacyPolicyLink}}</a> e i 
        <a aria-label="learn more about our terms of service" tabindex="2" class="cc-link" href="{{tosHref}}" target="_blank">{{tosLink}}</a>
      </span>
      `
    }
  )

  // Configurazione timeout chiamata http
  static readonly timeout = Object.freeze(
    {
      time: 10000,
      errorMsg: "Collegamento assente . Riprovare più tardi"
    }
  )
  // Tipologie di device
  static readonly deviceType = Object.freeze({
    ios: "iOS",
    android: "Android",
    web: 'web'
  })

  // Codici di risposta
  static readonly httpResponseCode = Object.freeze(
    {
      ok: "OK",
      ko: "KO",
      notLogged: "AS-0001"
    }
  )

  

}