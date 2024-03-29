/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.screenserviziwebsol;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Classe Java per Get_Date_Disponibili_WEBOutParametersType complex type.
 * 
 * <p>Il seguente frammento di schema specifica il contenuto previsto contenuto in questa classe.
 * 
 * <pre>
 * &lt;complexType name="Get_Date_Disponibili_WEBOutParametersType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *       &lt;/sequence>
 *       &lt;attribute name="codiceDiRitorno" type="{http://www.w3.org/2001/XMLSchema}int" />
 *       &lt;attribute name="O_ELENCO" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="O_NUM_ELEMENTI" type="{http://www.w3.org/2001/XMLSchema}int" />
 *       &lt;attribute name="O_ESITO" type="{http://www.w3.org/2001/XMLSchema}int" />
 *       &lt;attribute name="O_COD_ERRORE" type="{http://www.w3.org/2001/XMLSchema}int" />
 *       &lt;attribute name="O_DESCR_ERRORE" type="{http://www.w3.org/2001/XMLSchema}string" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Get_Date_Disponibili_WEBOutParametersType")
public class GetDateDisponibiliWEBOutParametersType {

    @XmlAttribute(name = "codiceDiRitorno")
    protected Integer codiceDiRitorno;
    @XmlAttribute(name = "O_ELENCO")
    protected String oelenco;
    @XmlAttribute(name = "O_NUM_ELEMENTI")
    protected Integer onumelementi;
    @XmlAttribute(name = "O_ESITO")
    protected Integer oesito;
    @XmlAttribute(name = "O_COD_ERRORE")
    protected Integer ocoderrore;
    @XmlAttribute(name = "O_DESCR_ERRORE")
    protected String odescrerrore;

    /**
     * Recupera il valore della proprietà codiceDiRitorno.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getCodiceDiRitorno() {
        return codiceDiRitorno;
    }

    /**
     * Imposta il valore della proprietà codiceDiRitorno.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setCodiceDiRitorno(Integer value) {
        this.codiceDiRitorno = value;
    }

    /**
     * Recupera il valore della proprietà oelenco.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getOELENCO() {
        return oelenco;
    }

    /**
     * Imposta il valore della proprietà oelenco.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setOELENCO(String value) {
        this.oelenco = value;
    }

    /**
     * Recupera il valore della proprietà onumelementi.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getONUMELEMENTI() {
        return onumelementi;
    }

    /**
     * Imposta il valore della proprietà onumelementi.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setONUMELEMENTI(Integer value) {
        this.onumelementi = value;
    }

    /**
     * Recupera il valore della proprietà oesito.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getOESITO() {
        return oesito;
    }

    /**
     * Imposta il valore della proprietà oesito.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setOESITO(Integer value) {
        this.oesito = value;
    }

    /**
     * Recupera il valore della proprietà ocoderrore.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getOCODERRORE() {
        return ocoderrore;
    }

    /**
     * Imposta il valore della proprietà ocoderrore.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setOCODERRORE(Integer value) {
        this.ocoderrore = value;
    }

    /**
     * Recupera il valore della proprietà odescrerrore.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getODESCRERRORE() {
        return odescrerrore;
    }

    /**
     * Imposta il valore della proprietà odescrerrore.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setODESCRERRORE(String value) {
        this.odescrerrore = value;
    }

}
