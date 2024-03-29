/*******************************************************************************

* Copyright Regione Piemonte - 2023

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/
package it.csi.apisan.apisancod.util;

import java.util.IllegalFormatException;

public enum ApisanCodStatus {
	UTENTE_NON_AUTORIZZATO(401, "Utente non Autorizzato"), 
	CODICE_FISCALE_NON_VALIDO(400, "Codice Fiscale %s non valido"),
	REFERTO_NON_TROVATO(404, "Referto non trovato"), 
	PARAMETRO_NON_VALIDO(400, "Parametro %s non valido");
	

	private int statusCode;
	private String descTemplate;

	ApisanCodStatus(int statusCode, String desc) {
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
