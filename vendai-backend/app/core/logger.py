import logging
import sys
import json
from datetime import datetime, timezone


class JSONFormatter(logging.Formatter):
    def format(self, record):
        levels_pt = {
            "INFO": "INFORMAÇÃO",
            "ERROR": "ERRO",
            "WARNING": "AVISO",
            "DEBUG": "DEPURAÇÃO",
            "CRITICAL": "CRÍTICO"
        }
        log_obj = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "nivel": levels_pt.get(record.levelname, record.levelname),
            "mensagem": record.getMessage(),
            "modulo": record.module,
            "funcao": record.funcName,
        }
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_obj)


def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())

    logger.handlers = [handler]
    return logger


logger = logging.getLogger("vendai")
