from typing import List, Literal, Union

from pydantic import BaseModel


class Reference(BaseModel):
    type: Literal['ref'] = 'ref'
    uid: str

    # Adding a prefix so is does not have the same hash as a domain whose name would be the same as
    # the uid
    def __hash__(self):
        return hash(f'__ref__{self.uid}')


PipelineOrDomainName = Union[List[dict], str]  # can be either a domain name or a complete pipeline
PipelineOrDomainNameOrReference = Union[PipelineOrDomainName, Reference]
