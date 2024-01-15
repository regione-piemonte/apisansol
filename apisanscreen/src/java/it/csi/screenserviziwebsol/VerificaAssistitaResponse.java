/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.screenserviziwebsol;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import it.csi.gestutility.ErroriType;


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
 *         &lt;element name="Errori" type="{http://www.csi.it/GestUtility/}ErroriType"/>
 *         &lt;element name="VerificaAssistitaOutParameters" type="{http://www.csi.it/ScreenServiziWebSOL/}VerificaAssistitaOutParametersType"/>
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
    "errori",
    "verificaAssistitaOutParameters"
})
@XmlRootElement(name = "VerificaAssistitaResponse")
public class VerificaAssistitaResponse {

    @XmlElement(name = "Errori", required = true)
    protected ErroriType errori;
    @XmlElement(name = "VerificaAssistitaOutParameters", required = true)
    protected VerificaAssistitaOutParametersType verificaAssistitaOutParameters;

    /**
     * Recupera il valore della proprietà errori.
     * 
     * @return
     *     possible object is
     *     {@link ErroriType }
     *     
     */
    public ErroriType getErrori() {
        return errori;
    }

    /**
     * Imposta il valore della proprietà errori.
     * 
     * @param value
     *     allowed object is
     *     {@link ErroriType }
     *     
     */
    public void setErrori(ErroriType value) {
        this.errori = value;
    }

    /**
     * Recupera il valore della proprietà verificaAssistitaOutParameters.
     * 
     * @return
     *     possible object is
     *     {@link VerificaAssistitaOutParametersType }
     *     
     */
    public VerificaAssistitaOutParametersType getVerificaAssistitaOutParameters() {
        return verificaAssistitaOutParameters;
    }

    /**
     * Imposta il valore della proprietà verificaAssistitaOutParameters.
     * 
     * @param value
     *     allowed object is
     *     {@link VerificaAssistitaOutParametersType }
     *     
     */
    public void setVerificaAssistitaOutParameters(VerificaAssistitaOutParametersType value) {
        this.verificaAssistitaOutParameters = value;
    }

}
