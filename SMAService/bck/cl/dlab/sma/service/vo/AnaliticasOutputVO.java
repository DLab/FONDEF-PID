package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.VOBase;

public class AnaliticasOutputVO extends VOBase {

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

	public void setCodigoBaseDato(java.lang.String codigoBaseDato) {
		set("codigoBaseDato", codigoBaseDato);
	}

	public String getCodigoBaseDato() {
		return get("codigoBaseDato");
	}

	public void setFuncion(java.lang.String funcion) {
		set("funcion", funcion);
	}

	public String getFuncion() {
		return get("funcion");
	}

	public void setCodigoPadre(java.lang.String codigoPadre) {
		set("codigoPadre", codigoPadre);
	}

	public String getCodigoPadre() {
		return get("codigoPadre");
	}
}