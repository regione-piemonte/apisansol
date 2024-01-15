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
 *         &lt;element name="Credenziali" type="{http://www.csi.it/ScreenServiziWebSOL/}CredenzialiType"/>
 *         &lt;element name="Check_Eta_ScreeningInParameters" type="{http://www.csi.it/ScreenServiziWebSOL/}Check_Eta_ScreeningInParametersType"/>
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
    "credenziali",
    "checkEtaScreeningInParameters"
})
@XmlRootElement(name = "Check_Eta_Screening")
public class CheckEtaScreening {

    @XmlElement(name = "Credenziali", required = true)
    protected CredenzialiType credenziali;
    @XmlElement(name = "Check_Eta_ScreeningInParameters", required = true)
    protected CheckEtaScreeningInParametersType checkEtaScreeningInParameters;

    /**
     * Recupera il valore della proprietà credenziali.
     * 
     * @return
     *     possible object is
     *     {@link CredenzialiType }
     *     
     */
    public CredenzialiType getCredenziali() {
        return credenziali;
    }

    /**
     * Imposta il valore della proprietà credenziali.
     * 
     * @param value
     *     allowed object is
     *     {@link CredenzialiType }
     *     
     */
    public void setCredenziali(CredenzialiType value) {
        this.credenziali = value;
    }

    /**
     * Recupera il valore della proprietà checkEtaScreeningInParameters.
     * 
     * @return
     *     possible object is
     *     {@link CheckEtaScreeningInParametersType }
     *     
     */
    public CheckEtaScreeningInParametersType getCheckEtaScreeningInParameters() {
        return checkEtaScreeningInParameters;
    }

    /**
     * Imposta il valore della proprietà checkEtaScreeningInParameters.
     * 
     * @param value
     *     allowed object is
     *     {@link CheckEtaScreeningInParametersType }
     *     
     */
    public void setCheckEtaScreeningInParameters(CheckEtaScreeningInParametersType value) {
        this.checkEtaScreeningInParameters = value;
    }

}
