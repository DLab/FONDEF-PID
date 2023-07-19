package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class TipoValidacion extends BaseSQL {

	public TipoValidacion() throws Exception {
		super();
	}

	public TipoValidacion(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}