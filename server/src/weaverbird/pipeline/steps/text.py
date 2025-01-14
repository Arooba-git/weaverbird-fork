from datetime import datetime
from typing import Literal
from zoneinfo import ZoneInfo

from pydantic import field_validator

from weaverbird.pipeline.steps.utils.base import BaseStep
from weaverbird.pipeline.steps.utils.render_variables import StepWithVariablesMixin
from weaverbird.pipeline.types import ColumnName


class TextStep(BaseStep):
    name: Literal["text"] = "text"
    text: datetime | int | float | bool | str
    new_column: ColumnName

    @field_validator("text")
    @classmethod
    def _text_validator(cls, value):
        if isinstance(value, datetime) and value.tzinfo is not None:
            return value.astimezone(ZoneInfo("UTC")).replace(tzinfo=None)
        return value


class TextStepWithVariable(TextStep, StepWithVariablesMixin):
    ...
