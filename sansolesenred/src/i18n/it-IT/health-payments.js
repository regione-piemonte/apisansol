/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

export default {
  // MDP
  // -------------------------------------------------------------------------------------------------------------------
  MDP: {

    KO: `
      <p>
        La fase di pagamento non è andata a buon fine. Puoi tornare alla lista dei pagamenti per effettuare un nuovo tentativo.
      </p>
      <p>
        Se il problema persiste puoi contattare l'assitenza comunicando l'Identificativo della transazione:
        <strong>{transactionId}</strong>
      </p>
    `,

    OK: `
      <p><strong>Il pagamento si è concluso correttamente.</strong></p>
      <p>Se hai indicato un indirizzo email riceverai una copia della ricevuta, altrimenti potrai recuperarla nella sezione dei  pagamenti effettuati.</p>
    `,
  },

  // PTW
  // -------------------------------------------------------------------------------------------------------------------
  // Numero pratica regionale
  NPR: `identificativo ticket/posizione debitoria`,
  FREE_PAYMENTS_HELPER: `
    <div>
    Per effettuare un pagamento è necessario fornire il codice fiscale dell'intestatario del
    pagamento, selezionare l'azienda sanitaria riportata sulla cedola del pagamento e l'@:HEALTH_PAYMENTS.NPR oppure il numero di ricetta
    </div>
  `,

  FREE_PAYMENTS_EXPLANATION: `
  In questo caso devi conoscere il codice fiscale dell'intestatario del pagamento e l'@:HEALTH_PAYMENTS.NPR (o in alternativa il numero della ricetta).
  `,

  PAYMENT_EMAIL_HELPER: `A questo indirizzo di e-mail invieremo le ricevute dei pagamenti effettuati`,

  PSP_DESCRIPTION: `PagoPA é un sistema di pagamenti elettronici realizzato per rendere più semplice, sicuro e
                        trasparente qualsiasi pagamento verso la Pubblica Amministrazione`,

  ANONYMOUS_HOME: {
    INFO: `
      Autenticandoti potremmo proporti in automatico le posizioni debitorie (ticket) effettuate presso tutte
      le Aziende Sanitarie piemontesi.
    `,

    PAYMENTS: {
      MAIN: `
        <h2 class="csi-h2 q-mb-md">Pagamenti Sanitari</h2>
        <p>
          Paga online con carta di credito e tramite gli altri servizi messi a disposizione da pagoPA.
        </p>
      `,

      MORE: `
        <h3 class="csi-h3 q-mb-md">Vantaggi</h3>
        <ul>
          <li>evitare le code agli sportelli</li>
          <li>essere svincolati dagli orari di servizio</li>
          <li>poter pagare ovunque tu sia</li>
          <li>non doversi recare fisicamente presso sportelli bancari, farmacie convenzionate e punti gialli
          </li>
          <li>stampare la ricevuta tutte le volte che occorre</li>
        </ul>


        <h3 class="csi-h3 q-mb-md">Cosa occorre</h3>
        <div>
          Per accedere al pagamento o alla stampa della ricevuta tieni a portata di mano il promemoria che
          ti è
          stato
          consegnato durante prenotazione.
        </div>

        <div>
          Sul promemoria troverai tutti i dati necessari:
          <ul>
            <li>@:HEALTH_PAYMENTS.NPR</li>
            <li>Codice fiscale dell'intestatario della prenotazione</li>
          </ul>
        </div>
      `
    },

    OTHER_PAYMENTS: `
      <h2 class="csi-h2 q-mb-md">Altri pagamenti</h2>
      <p>Puoi effettuare altri pagamenti non relativi a prestazioni sanitarie</p>
      <p class="q-caption">(Es: Mensa, Concorsi, Oneri funerari ecc)</p>
    `,

    RECEIPT: `
      <h2 class="csi-h2 q-mb-md">Recupera la ricevuta di un pagamento già effettuato</h2>
      <p>
        Se non hai potuto salvare o stampare la ricevuta o l'hai smarrita non preoccuparti, puoi recuperarla ogni
        volta che lo desideri.
      </p>
    `
  }
}
