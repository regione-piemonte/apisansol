/*
 * SPDX-License-Identifier: EUPL-1.2
 * Copyright Regione Piemonte - 2022
 */

ALTER TABLE sansol.lms_applicazioni ADD soddisfazione_cliente_visibile tinyint(1) DEFAULT 0 NOT NULL COMMENT 'Permette di configurare la visibilit� del bottone soddisfazione_cliente';
ALTER TABLE sansol.lms_applicazioni ADD soddisfazione_cliente_url varchar(255) NULL COMMENT 'Url alla pagina di soddisfazione_cliente';
