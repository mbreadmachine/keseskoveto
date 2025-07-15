import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [trains, setTrains] = useState([]);
  const [avgDelay, setAvgDelay] = useState(0);
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch("https://b.vonatterkep.hu/trains.json", {
        headers: {
          "Origin": "https://vonatterkep.hu",
          "Referrer": "https://vonatterkep.hu"
        }
      });
      if (!response.ok) {
        throw new Error(response.status);
      }
      const json = await response.json();
      const final = json.vehiclePositions.sort(
        (a, b) =>
          b.trip.arrivalStoptime.arrivalDelay -
          a.trip.arrivalStoptime.arrivalDelay
      );

      setAvgDelay(calculateDelay(final));
      setTrains(final);
      setFinished(true)
    } catch (err) {
      alert(err);
    }
  }

  function calculateDelay(trainSet) {
    let i = 0;
    let sum = 0;

    trainSet.forEach((train) => {
      i++;
      sum += train.trip.arrivalStoptime.arrivalDelay;
    });

    return sum / i;
  }

  return (
    <>
      <header className="headersect">
        <div className="titlesect">
          <h1 className="titlewithsubtitle">KésésKövető</h1>
          <h2 className="subtitle">
            Jelenlegi késési adatok (2024. 09. 12. 13:23)
          </h2>
        </div>
        <hr></hr>
        {!finished ? (
          <img src="loading.gif" />
        ) : (
          <div className="statsect">
            <div>
              <p className="statnum">{(avgDelay / 60).toFixed(1)} perc</p>
              <h3>Jelenlegi átlagos késés</h3>
            </div>
            <div>
              <p className="statnum">
                {trains[0].trip.arrivalStoptime.arrivalDelay / 60} perc
              </p>
              <h3>Jelenlegi legnagyobb késés</h3>
            </div>
          </div>
        )}
      </header>
      {!finished ? (
        <img src="loading.gif" />
      ) : (
        <main className="leaderboardsect">
          <table className="leaderboard">
            <thead>
              <tr className="bold">
                <th className="bold leftalign"><span className="lefalign">Vonat</span></th>
                <th className="bold">Irány</th>
                <th className="bold">Késés</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((train) => {
                const trainIconHtml = { __html: train.trip.routeShortName };

                return (
                  <tr>
                    <th className="traindirection">
                      <div
                        dangerouslySetInnerHTML={trainIconHtml}
                        style={{ color: "#" + train.trip.route.textColor }}
                      ></div>
                      <div style={{ marginLeft: "10px" }} className="bold">
                        <p>{train.trip.tripShortName}</p>
                      </div>
                    </th>
                    <th>{train.trip.arrivalStoptime.stop.name}</th>
                    <th className="bold">
                      {train.trip.arrivalStoptime.arrivalDelay / 60} perc
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
      )}
    </>
  );
}

export default App;
