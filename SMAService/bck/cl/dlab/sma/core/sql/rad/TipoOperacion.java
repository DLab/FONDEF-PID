package cl.dlab.sma.core.sql.rad;

import cl.dlab.sma.core.sql.BaseSQL;
import java.sql.Connection;

public class TipoOperacion extends BaseSQL {

	public TipoOperacion() throws Exception {
		super();
	}

	public TipoOperacion(Connection con, java.lang.Boolean commitAndClose)
			throws Exception {
		super(con, commitAndClose);
	}
}