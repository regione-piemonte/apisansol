/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisanaut.util;

import java.util.IllegalFormatException;

public enum ApisanAutStatus {

	UTENTE_NON_AUTORIZZATO(401, "Utente non Autorizzato"), 
	CODICE_FISCALE_NON_VALIDO(400, "Codice Fiscale %s non valido"),
	PARAMETRO_NON_VALIDO(400, "Parametro %s non valido"), 
	RISORSA_NON_TROVATA(404, "Risorsa non trovata");

	private int statusCode;
	private String descTemplate;

	ApisanAutStatus(int statusCode, String desc) {
		this.statusCode = statusCode;
		this.descTemplate = desc;
	}

	public int getStatusCode() {
		return statusCode;
	}
	
	public String getMessage(Object... args) {
		try {
			return String.format(descTemplate, args);
		} catch (IllegalFormatException ife) {
			ife.printStackTrace();
			return descTemplate;
		}
	}


	
	
}
