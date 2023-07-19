package cl.dlab.sma.service.vo;

import cl.dlab.sma.service.vo.InputVO;

public class RolInputVO extends InputVO {

	@Override
	public Class<RolOutputVO> getOutputClass() {
		return RolOutputVO.class;
	}
}