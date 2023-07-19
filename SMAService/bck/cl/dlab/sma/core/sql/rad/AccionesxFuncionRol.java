package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class AccionesxFuncionRol extends BaseSQL {

	public AccionesxFuncionRol() throws Exception {
		super();
	}

	public AccionesxFuncionRol(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}