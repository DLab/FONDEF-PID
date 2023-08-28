package cl.dlab.sma.service.vo;

public class ClasificacionInputVO extends InputVO {

	@Override
	public Class<ClasificacionOutputVO> getOutputClass() {
		return ClasificacionOutputVO.class;
	}
}