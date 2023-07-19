package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class FuncionInputVO extends InputVO {

	@Override
	public Class<FuncionOutputVO> getOutputClass() {
		return FuncionOutputVO.class;
	}
}