package cl.dlab.sma.service.vo;

public class TipoDatoInputVO extends InputVO {

	@Override
	public Class<TipoDatoOutputVO> getOutputClass() {
		return TipoDatoOutputVO.class;
	}
}