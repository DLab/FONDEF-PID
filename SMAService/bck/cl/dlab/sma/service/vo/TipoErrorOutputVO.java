package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.VOBase;

public class TipoErrorOutputVO extends VOBase {

	public void setCodigo(java.lang.String codigo) {
		set("codigo", codigo);
	}

	public String getCodigo() {
		return get("codigo");
	}

	public void setDescripcion(java.lang.String descripcion) {
		set("descripcion", descripcion);
	}

	public String getDescripcion() {
		return get("descripcion");
	}
}