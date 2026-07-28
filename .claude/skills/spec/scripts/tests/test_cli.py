import sys, pathlib, subprocess
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from check_graph import run
SC = pathlib.Path(__file__).resolve().parents[1] / "check_graph.py"
def fx(name): return str(pathlib.Path(__file__).parent / "fixtures" / name)

def test_clean_zero_findings():
    assert run(fx("clean")) == []

def test_unknown_edge_type_flagged():
    assert any(f.code == "EDGE_VOCAB" for f in run(fx("badvocab")))

def test_cli_exit_codes():
    assert subprocess.run([sys.executable, str(SC), fx("clean")]).returncode == 0
    assert subprocess.run([sys.executable, str(SC), fx("badvocab")]).returncode == 1
