from typing import Literal

from weaverbird.pipeline.steps.utils.base import BaseStep
from weaverbird.pipeline.steps.utils.render_variables import StepWithVariablesMixin

from ..conditions import Condition, ConditionWithVariables


class FilterStep(BaseStep):
    name: Literal["filter"] = "filter"
    condition: Condition


class FilterStepWithVariables(FilterStep, StepWithVariablesMixin):
    condition: ConditionWithVariables  # type:ignore[assignment]
