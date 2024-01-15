/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.gpr;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Classe Java per anonymous complex type.
 * 
 * <p>Il seguente frammento di schema specifica il contenuto previsto contenuto in questa classe.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="RISPOSTA" type="{http://csi.it}LMSGetRicevutaResponseType"/>
 *         &lt;element name="ERRORE" type="{http://csi.it}Errore"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "risposta",
    "errore"
})
@XmlRootElement(name = "LMSGetRicevutaResponse")
public class LMSGetRicevutaResponse {

    @XmlElement(name = "RISPOSTA", required = true)
    protected LMSGetRicevutaResponseType risposta;
    @XmlElement(name = "ERRORE", required = true)
    protected Errore errore;

    /**
     * Recupera il valore della proprieta risposta.
     * 
     * @return
     *     possible object is
     *     {@link LMSGetRicevutaResponseType }
     *     
     */
    public LMSGetRicevutaResponseType getRISPOSTA() {
        return risposta;
    }

    /**
     * Imposta il valore della proprieta risposta.
     * 
     * @param value
     *     allowed object is
     *     {@link LMSGetRicevutaResponseType }
     *     
     */
    public void setRISPOSTA(LMSGetRicevutaResponseType value) {
        this.risposta = value;
    }

    /**
     * Recupera il valore della proprieta errore.
     * 
     * @return
     *     possible object is
     *     {@link Errore }
     *     
     */
    public Errore getERRORE() {
        return errore;
    }

    /**
     * Imposta il valore della proprieta errore.
     * 
     * @param value
     *     allowed object is
     *     {@link Errore }
     *     
     */
    public void setERRORE(Errore value) {
        this.errore = value;
    }

}
