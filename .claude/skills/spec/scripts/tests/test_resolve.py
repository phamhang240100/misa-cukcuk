import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from check_graph import load_graph, check_resolve
FIX = str(pathlib.Path(__file__).parent / "fixtures" / "resolve")

def test_flags_unresolved_edge_and_link_only():
    findings = check_resolve(load_graph(FIX))
    msgs = {f.message for f in findings if f.code == "UNRESOLVED"}
    assert any("Ghost" in m for m in msgs)      # relation target anchor missing
    assert any("NOPE" in m for m in msgs)       # inline link anchor missing
    assert not any("BR-M01-01" in m for m in msgs)  # this one resolves -> not flagged
