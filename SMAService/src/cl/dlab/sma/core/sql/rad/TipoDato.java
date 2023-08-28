package cl.dlab.sma.core.sql.rad;

import java.sql.Connection;

import cl.dlab.sma.core.sql.BaseSQL;

public class TipoDato extends BaseSQL {

	public TipoDato() throws Exception {
		super();
	}

	public TipoDato(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}