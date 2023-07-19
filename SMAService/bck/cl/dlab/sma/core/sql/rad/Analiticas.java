package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class Analiticas extends BaseSQL {

	public Analiticas() throws Exception {
		super();
	}

	public Analiticas(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}