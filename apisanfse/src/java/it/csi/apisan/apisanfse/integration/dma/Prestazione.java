/*******************************************************************************

* Copyright Regione Piemonte - 2022

* SPDX-License-Identifier: EUPL-1.2

******************************************************************************/

package it.csi.apisan.apisanfse.integration.dma;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Classe Java per prestazione complex type.
 * 
 * <p>Il seguente frammento di schema specifica il contenuto previsto contenuto in questa classe.
 * 
 * <pre>
 * &lt;complexType name="prestazione">
 *   &lt;complexContent>
 *     &lt;extension base="{http://dma.csi.it/}codifica">
 *       &lt;sequence>
 *         &lt;element name="branca" type="{http://dma.csi.it/}branca" minOccurs="0"/>
 *         &lt;element name="dataOra" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/>
 *         &lt;element name="idPrestazione" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="valoriPrestazione" type="{http://dma.csi.it/}valoriPrestazione" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "prestazione", propOrder = {
    "branca",
    "dataOra",
    "idPrestazione",
    "valoriPrestazione"
})
public class Prestazione
    extends Codifica
{

    protected Branca branca;
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar dataOra;
    protected Long idPrestazione;
    protected ValoriPrestazione valoriPrestazione;

    /**
     * Recupera il valore della proprietà branca.
     * 
     * @return
     *     possible object is
     *     {@link Branca }
     *     
     */
    public Branca getBranca() {
        return branca;
    }

    /**
     * Imposta il valore della proprietà branca.
     * 
     * @param value
     *     allowed object is
     *     {@link Branca }
     *     
     */
    public void setBranca(Branca value) {
        this.branca = value;
    }

    /**
     * Recupera il valore della proprietà dataOra.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getDataOra() {
        return dataOra;
    }

    /**
     * Imposta il valore della proprietà dataOra.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setDataOra(XMLGregorianCalendar value) {
        this.dataOra = value;
    }

    /**
     * Recupera il valore della proprietà idPrestazione.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getIdPrestazione() {
        return idPrestazione;
    }

    /**
     * Imposta il valore della proprietà idPrestazione.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setIdPrestazione(Long value) {
        this.idPrestazione = value;
    }

    /**
     * Recupera il valore della proprietà valoriPrestazione.
     * 
     * @return
     *     possible object is
     *     {@link ValoriPrestazione }
     *     
     */
    public ValoriPrestazione getValoriPrestazione() {
        return valoriPrestazione;
    }

    /**
     * Imposta il valore della proprietà valoriPrestazione.
     * 
     * @param value
     *     allowed object is
     *     {@link ValoriPrestazione }
     *     
     */
    public void setValoriPrestazione(ValoriPrestazione value) {
        this.valoriPrestazione = value;
    }

}
